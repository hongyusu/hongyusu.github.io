---
title: "Scaling NLP Inference: Lessons from Managing SageMaker Endpoints"
tags: [NLP, AWS, SageMaker, MLOps, Infrastructure]
description: "The second iteration of our NLP system focused on better endpoint management, model versioning, and multi-endpoint orchestration."
---

## Why a Second Iteration

The first version worked but had friction points. Updating models required manual intervention. Managing multiple endpoints (one per classification task) was error-prone. We needed a system that could track model freshness, auto-deploy approved versions, and handle endpoint lifecycle without babysitting.

## The Endpoint Manager

We built a dedicated **SageMaker Endpoint Manager** — a Python service that:

1. **Queried the model registry** for the latest approved model version per task
2. **Compared versions** against running endpoints (UP_TO_DATE, OUT_OF_DATE, NOT_DEPLOYED)
3. **Auto-deployed or updated** endpoints when new versions were approved
4. **Handled lifecycle** — creation, update, and teardown

This gave us a declarative model: define which models should be deployed, and the manager ensures reality matches intent.

## Multi-Endpoint Architecture

Each classification dimension (sentiment, brand perception, product attributes, etc.) got its own SageMaker endpoint. This isolation meant:

- Independent scaling per task
- Independent model updates without affecting others
- Easy A/B testing by running two model versions side-by-side

The trade-off was operational complexity — managing 20+ endpoints is more work than managing one, even with automation.

## What We Learned

**Model registry is essential.** Without a proper versioning and approval workflow, deploying ML models to production is a mess. SageMaker's model registry with approval states (PendingManualApproval → Approved) gave us the gate we needed.

**Endpoint management is infrastructure, not application code.** We initially embedded endpoint management in the application. Extracting it into a dedicated service made both simpler.

**SageMaker costs add up.** Even with serverless endpoints, the per-invocation costs and cold start overhead were significant at our scale. This made us start looking at alternatives.

## The Deprecation

By mid-2024, we deprecated SageMaker endpoints entirely in favor of LLM-based approaches. The rise of large language models changed the economics: a single foundation model with good prompts could replace a fleet of task-specific models, with better accuracy and no training pipeline to maintain.

## Technical Stack

- SageMaker Serverless Endpoints — model inference
- SageMaker Model Registry — model versioning and approval
- MLflow — experiment tracking and model comparison
- Python — endpoint manager service
- CloudWatch — monitoring and alerting
