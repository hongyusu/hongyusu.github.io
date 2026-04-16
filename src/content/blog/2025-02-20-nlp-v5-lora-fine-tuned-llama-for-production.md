---
title: "LoRA Fine-Tuned LLaMA 3.1 for Production NLP: The Full Stack"
tags: [NLP, LoRA, LLaMA, FineTuning, MLOps, AWS]
description: "Building a production system for multi-label text classification using LoRA-adapted LLaMA 3.1 8B on autoscaling EC2 — from training to deployment."
---

> *Note: To protect proprietary details, specific names, labels, and configurations in this post have been adapted into a similar but fictional context. The architectural decisions, trade-offs, and lessons learned are real.*

## The Motivation

Our [Bedrock-based LLaMA 70B labeler](/blog/2024-08-15-nlp-v4-llama-on-bedrock-ditching-openai/) worked well for classification but had a fundamental inefficiency: we were using a 70-billion parameter model to output a single label per text. That's like using a rocket engine to power a bicycle. Meanwhile, the [summarizer](/blog/2024-10-01-building-an-llm-summarizer-for-survey-analytics/) stayed on Bedrock (where the 70B model's language generation strength was actually needed).

The hypothesis: a much smaller model (8B parameters), fine-tuned with **LoRA (Low-Rank Adaptation)** for each specific classification task, could match the 70B prompt-based labeler at a fraction of the cost and latency.

## What Is LoRA

LoRA fine-tunes a pre-trained model by injecting small trainable matrices into the transformer layers while keeping the original weights frozen. The key benefits:

- **Memory efficient**: Only the adapter weights are trained (~1-2% of total parameters)
- **Fast training**: Minutes to hours instead of days
- **Composable**: Multiple LoRA adapters can share the same base model
- **Small artifacts**: Each adapter is a few hundred MB, not tens of GB

For our use case, we trained a separate LoRA adapter for each classification dimension — around 25 adapters covering things like sentiment polarity, visual appeal, credibility, purchase likelihood, eco-consciousness, and more — all sharing the same LLaMA 3.1 8B base.

## System Architecture

The system has three layers:

### 1. Inference (EC2 + GPU)

Each EC2 instance runs a Docker container with:
- **LLaMA 3.1 8B** base model loaded once into GPU memory (bfloat16)
- **LoRA adapters** downloaded from MLflow and merged at runtime
- **HuggingFace text-generation pipeline** with greedy decoding (temperature=0, max_tokens=2)
- A manager daemon that polls for work from PostgreSQL

For each batch of texts:
1. Query queued texts from the database
2. For each label , spawn a model runner subprocess
3. Load the base model + merge the label's LoRA adapter
4. Generate predictions in batches
5. Write results to parquet, update database

### 2. Orchestration (Lambda + PostgreSQL)

Three Lambda functions manage the lifecycle:

- **accept-new-batch**: HTTP endpoint that accepts a JSON batch of texts, stores to PostgreSQL
- **manage-ec2-instances**: Periodic trigger that monitors queue depth and spins up/down EC2 instances
- **write-results**: Polls for completed batches, aggregates results, writes final parquet to S3

PostgreSQL tracks the state machine: `queued → starting → in_progress → succeeded/failed`.

### 3. Autoscaling

The system scales from **zero to N EC2 instances** based on queue depth:
- No queued texts → no instances running (zero cost)
- Texts arrive → Lambda provisions GPU instances
- Heartbeat mechanism prevents premature termination
- Cooldown periods prevent thrashing
- Stale texts (from crashed instances) are automatically re-queued

## MLflow for Model Management

Each LoRA adapter is versioned in MLflow with environment tags:

```
MLflow Registry:
├── sentiment_polarity   (v12, prod=approved)
├── visual_appeal        (v8, prod=approved)
├── credibility          (v5, dev=approved)
├── purchase_likelihood  (v3, prod=approved)
└── ... (~25 labels total)
```

The model runner queries MLflow for the latest approved adapter per environment. This decouples training from deployment — a new adapter is deployed simply by tagging it as approved.

## Results vs Previous Approaches

| Metric | SageMaker v1 | GPT Prompts v3 | Bedrock 70B v4 | LoRA 8B v5 |
|--------|-------------|----------------|----------------|------------|
| Accuracy | Baseline | +2% | +2% | +3% |
| Cost/1000 texts | $$ | $$$$ | $$ | $ |
| Latency | Seconds | Variable | Seconds | Sub-second |
| New label setup | Weeks | Hours | Hours | Days (training) |
| Infrastructure | Managed | External API | Managed | Self-managed |

The 8B LoRA model matched or exceeded the 70B prompt-based model on most benchmarks, at roughly 10x lower inference cost. The trade-off is the upfront training investment and infrastructure complexity.

## Lessons Learned

**LoRA adapters are surprisingly effective.** A task-specific 8B model consistently outperformed a general-purpose 70B model with prompt engineering. Specialization beats scale for narrow tasks.

**Autoscaling GPU instances is hard.** Unlike Lambda or Fargate, EC2 GPU instances have minutes-long startup times. The autoscaling logic needed careful tuning of cooldowns, heartbeats, and queue thresholds.

**PostgreSQL over DynamoDB for state machines.** We needed ACID transactions for reliable state tracking across concurrent workers. PostgreSQL's row-level locking was essential.

**Distributed tracing is worth the investment.** OpenTelemetry spans propagated from Lambda through EC2 to individual model runners. When something failed at 2 AM, we could trace the exact request path.

**Parquet for ML I/O.** Columnar format for batch processing just works. Efficient compression, schema enforcement, and compatibility with every data tool.

## What's Next

The LoRA approach opens up possibilities we couldn't consider before:
- Per-client model customization (train adapters on client-specific data)
- Rapid A/B testing of model variants
- Multi-language adapters sharing the same base model

The infrastructure is in place. The iteration cycle is now measured in days, not months.

## Technical Stack

- LLaMA 3.1 8B — base model (HuggingFace Transformers)
- PEFT/LoRA — parameter-efficient fine-tuning
- PyTorch + CUDA — GPU inference (bfloat16)
- MLflow — model registry and adapter versioning
- AWS Lambda (TypeScript) — orchestration
- AWS EC2 (GPU) — autoscaling inference
- PostgreSQL (RDS) — state tracking
- S3 — input/output storage (Parquet)
- Pulumi — infrastructure as code
- OpenTelemetry — distributed tracing
- Docker — containerized model runners
