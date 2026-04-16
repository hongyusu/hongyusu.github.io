---
title: "From Custom Models to GPT: Replacing a Training Pipeline with Prompt Engineering"
tags: [NLP, GPT, OpenAI, LLM, PromptEngineering]
description: "How we replaced task-specific ML models with GPT-3.5/4 prompts for text classification and summarization — and what surprised us."
---

> *Note: To protect proprietary details, specific names, labels, and configurations in this post have been adapted into a similar but fictional context. The architectural decisions, trade-offs, and lessons learned are real.*

## The Shift

For two years, our NLP pipeline relied on custom-trained classification models. Each new label required collecting training data, training a model, validating it, and deploying it through the SageMaker pipeline. Adding a new classification dimension took weeks.

Then GPT happened. We ran an experiment: could a well-crafted prompt match our trained models on multi-label text classification? The answer was yes — and the iteration speed was incomparably faster.

## Architecture

We built a dual-purpose interface supporting both OpenAI and AWS Bedrock:

**Classification (NLPv3):**
- GPT-3.5-turbo (16K context) for multi-label classification
- Detailed label definitions in the system prompt
- Temperature near zero for deterministic outputs
- JSON output format with structured validation
- Optional "second opinion" via `n=2` (two independent completions)

**Summarization:**
- GPT-3.5/4 for extracting themes from survey responses
- Positive/negative sentiment extraction with percentages
- Uniqueness analysis (how does product X differ from competitors)
- Token-aware chunking for large batches (tiktoken-based splitting)

## The Prompt Is the Model

The biggest mindset shift: **the prompt IS the model**. Instead of training a classifier, we wrote detailed label definitions with examples and edge cases. A typical prompt looked like:

```
You are an expert text analyst. Given the following customer feedback,
classify the overall credibility perception as:
- "high" if the text conveys strong trust or believability
- "low" if the text expresses skepticism or doubt
- "neutral" if the text does not address credibility
Respond with a JSON object: {"label": "high"|"low"|"neutral"}
```

Updating the "model" meant editing a prompt — no data collection, no training, no deployment. This reduced our iteration cycle from weeks to hours.

## Challenges

**Cost at scale.** GPT-3.5-turbo is cheap per call, but classifying large volumes of texts across many dimensions adds up. We needed batching and caching strategies to keep costs manageable.

**Latency variance.** OpenAI API response times were unpredictable — sometimes 200ms, sometimes 10 seconds. Rate limiting and retry logic became essential.

**Vendor dependency.** Building on OpenAI's API meant accepting their pricing, availability, and model deprecation decisions. This motivated our move to self-hosted alternatives.

**Output consistency.** LLMs occasionally produce malformed JSON or hallucinated labels. We built robust response parsing with fallbacks and validation.

## Results

- Classification accuracy comparable to trained models (within 2-3% on our benchmarks)
- New label dimensions added in hours instead of weeks
- Summarization quality significantly better than any extractive approach we'd tried
- But: higher per-query cost and external dependency

## What Came Next

The cost and dependency concerns pushed us toward AWS Bedrock with open-source LLMs (LLaMA) — same prompt-based approach, but self-hosted within our AWS environment.

## Technical Stack

- OpenAI API (GPT-3.5-turbo, GPT-4) — inference
- tiktoken — token counting and chunking
- tenacity — retry logic with exponential backoff
- AWS Secrets Manager — API key management
- JSON schema validation — output parsing
