---
title: "LLaMA on AWS Bedrock: Ditching OpenAI for Production NLP"
tags: [NLP, LLaMA, AWSBedrock, LLM, Infrastructure]
description: "Moving from OpenAI GPT to Meta's LLaMA 3 on AWS Bedrock for production text classification and summarization — cost, performance, and architecture."
---

## Why Move Away from OpenAI

Three reasons pushed us from OpenAI to AWS Bedrock with LLaMA:

1. **Cost** — At our scale, OpenAI API costs were significant. Bedrock's pricing for LLaMA was substantially lower.
2. **Data residency** — Our data stayed within our AWS environment. No external API calls, no data leaving our VPC.
3. **Control** — No dependency on OpenAI's model deprecation schedule, rate limits, or availability.

## The Bedrock Setup

AWS Bedrock provides managed access to foundation models without managing infrastructure. We focused first on the **classification service** — the core engine for multi-label text analysis. The summarizer followed as a separate system (covered in a [dedicated post](/blog/2024-10-01-building-an-llm-summarizer-for-survey-analytics/)).

### Classification Service (LLaMA 3 70B)

Multi-label text classification across around 25 dimensions — covering aspects like sentiment polarity, visual appeal, credibility, perceived quality, purchase likelihood, eco-consciousness, and more:

- **Model**: LLaMA 3 70B via AWS Bedrock
- **Batch processing**: Texts grouped into batches of 40-60, processed with high concurrency
- **Temperature**: 0.5 with top-p sampling
- **Output**: Structured JSON with label assignments per text
- **Prompts**: Extensive label definitions (~30KB of prompt engineering) with examples and edge cases, versioned per environment
- Pydantic validation on every response
- DynamoDB caching layer for repeat classifications

## Prompt Engineering for LLaMA vs GPT

LLaMA and GPT respond differently to the same prompts. Key differences we discovered:

**Instruction following.** GPT-3.5 is more forgiving with loose instructions. LLaMA 3 needs more explicit formatting directives — especially for JSON output.

**Context window.** LLaMA 3 70B has a generous context window but we found accuracy degraded with very long inputs. We kept batch sizes moderate (50 texts) rather than stuffing the context.

**Temperature sensitivity.** LLaMA at temperature 0.5 produced more diverse outputs than GPT at the same temperature. We tuned per-task.

**JSON reliability.** LLaMA occasionally produced JSON with trailing commas or missing brackets. We added a `json_repair` library to handle this automatically.

## Architecture Decisions

**Lambda + Bedrock, not ECS.** Since Bedrock handles the model hosting, our inference code is just an API call. Lambda was sufficient — no need for persistent compute.

**25 retries with exponential backoff.** Bedrock occasionally throttles or times out. Generous retry logic ensured batch completion.

**MLflow for prompt management.** We stored prompt templates as MLflow artifacts, versioned and tagged per environment (dev/prod). This let us update prompts without code deploys.

**Dual model support.** The summarizer supports both LLaMA and Claude, selectable per request. This gave us flexibility when one model performed better on specific analysis types.

## Results

Compared to the OpenAI approach:
- **60-70% cost reduction** for equivalent throughput
- **Comparable accuracy** on classification benchmarks
- **Better data governance** — everything stays in AWS
- **More predictable latency** — no external API variability

## What Still Wasn't Perfect

The 70B model is powerful but expensive per-token. For classification — where the output is just a single label — using a 70B parameter model felt wasteful. This led us to explore fine-tuning a smaller model with LoRA adapters.

## Technical Stack

- AWS Bedrock Runtime — model inference
- Meta LLaMA 3 / 3.1 70B — primary model
- Anthropic Claude Sonnet — fallback model
- AWS Lambda — orchestration
- MLflow — prompt versioning
- DynamoDB — response caching
- json_repair — malformed JSON recovery
- Pydantic — response validation
