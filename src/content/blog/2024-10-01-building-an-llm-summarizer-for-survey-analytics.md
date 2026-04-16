---
title: "Building an LLM-Powered Survey Summarizer: From GPT to Bedrock"
tags: [NLP, LLM, AWSBedrock, LLaMA, Claude, Summarization]
description: "How we built a production summarization system that extracts themes, sentiment, and value propositions from survey responses using LLaMA and Claude on AWS Bedrock."
---

## The Problem

Survey data is messy. Thousands of open-ended responses that need to be distilled into actionable insights: what do customers love, what do they hate, what makes the product unique, and what's the value proposition. Manual analysis doesn't scale.

We needed a system that could perform multiple types of analysis on survey text — from simple positive/negative extraction to complex value proposition generation — reliably, at scale, and with structured output.

## Evolution: GPT to Bedrock

### Phase 1: GPT Summarizer (Early 2024)

The first version used OpenAI's GPT-3.5-turbo with chunked inputs and token-aware splitting. It worked but had the same issues as our GPT-based labeler: cost, latency variance, and vendor dependency.

### Phase 2: Bedrock Summarizer (August 2024)

We rebuilt the summarizer as a containerized Lambda function using AWS Bedrock with LLaMA 3.1. This gave us data residency, predictable costs, and no external API dependency.

The initial model was LLaMA 3.1 8B — small and fast. We upgraded to the 70B variant for better analysis quality, but found that token limits on some analysis types required falling back to the smaller model. The system now dynamically selects between model sizes based on input length.

### Phase 3: Multi-Model Support (January 2025)

We added Claude Sonnet as a secondary model, selectable at runtime. Some analysis types — particularly value proposition generation — performed better with Claude's more nuanced language generation. The system now accepts a `model` parameter in each request.

## The 11 Analysis Types

The summarizer isn't one prompt — it's a suite of specialized analyses covering:

- **Theme extraction** — identifying positive and negative themes with response proportions
- **Differentiation analysis** — what makes the product unique vs competitors
- **Question-level summaries** — topics from specific survey questions
- **Per-label analysis** — sentiment breakdowns per classification dimension
- **Value proposition generation** — synthesizing insights into actionable positioning statements

Each analysis type has its own prompt template, output schema, and validation rules.

## Prompt Management

Managing many prompt templates across environments was a challenge. We built a dual-repository system:

**MLflow (primary):** Prompts stored as model artifacts, versioned and tagged per environment (dev/prod). Updating a prompt means registering a new model version and tagging it as approved.

**LangSmith (added later):** For faster iteration. Prompts can be updated without code deploys, fetched at runtime by name and environment. This decoupled prompt engineering from the deployment cycle.

The system selects which repository to use per request, defaulting to MLflow for backward compatibility.

## Making LLMs Produce Reliable JSON

The biggest engineering challenge: getting LLMs to consistently produce valid, parseable JSON. Our strategies:

**Explicit format instructions.** Every prompt ends with a JSON schema example and "respond ONLY with valid JSON."

**JSON repair.** Despite instructions, LLaMA occasionally produces trailing commas, missing brackets, or unquoted keys. We use automated JSON repair as a post-processing step rather than failing.

**Generous retry logic.** Bedrock throttling and transient errors are common at high concurrency. Exponential backoff with many retry attempts ensures batch completion.

**Validation.** Every response is validated against a Pydantic schema. Invalid responses trigger a retry with the error message fed back to the model.

**Temperature tuning.** Counter-intuitively, slightly higher temperature produced more diverse (and less repetitively malformed) outputs on retries.

## Token Management

Survey batches can contain thousands of responses. We handle large inputs through:

- **Token counting** with tiktoken
- **Deterministic sampling** — when inputs exceed the token limit, we randomly sample a subset using a fixed seed for reproducibility
- **Automatic label selection** — top 5 labels by response volume, excluding system labels
- **Per-label processing** — each label's responses are analyzed independently

## Architecture

```
Client Request (JSON or gzip)
    ↓
Lambda (containerized, Python 3.12)
    ├── Validate request schema
    ├── Load prompts from MLflow or LangSmith
    ├── For each analysis type requested:
    │   ├── Format prompt with model-specific formatter
    │   ├── Invoke Bedrock (LLaMA or Claude)
    │   ├── Parse + repair JSON response
    │   └── Validate against Pydantic schema
    ├── Aggregate results
    └── Return gzip-compressed response
```

Request and response payloads are logged to S3 for debugging and audit.

## Results

The Bedrock summarizer processes surveys at scale with:
- **Sub-second latency** for individual analyses
- **Multiple analysis types** from a single endpoint
- **Dual model support** (LLaMA for speed, Claude for nuance)
- **Zero vendor lock-in** — runs entirely within AWS
- **Prompt iteration without deploys** via LangSmith

## Technical Stack

- AWS Lambda (containerized) — inference runtime
- AWS Bedrock — LLaMA 3.1 (70B/8B) and Claude Sonnet 4
- MLflow — prompt versioning (primary)
- LangSmith — prompt management (secondary)
- tiktoken — token counting
- json_repair — malformed JSON recovery
- Pydantic — response validation
- S3 — request/response logging
- Slack — error alerting
