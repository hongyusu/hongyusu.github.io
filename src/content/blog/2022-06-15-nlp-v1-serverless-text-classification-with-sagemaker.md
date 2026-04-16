---
title: "Building a Serverless NLP Pipeline with AWS Lambda and SageMaker"
tags: [NLP, AWS, SageMaker, Lambda, MLOps]
description: "How we built our first production NLP system for survey text classification using SageMaker serverless endpoints and Lambda orchestration."
---

## The Problem

We needed to classify open-ended survey responses at scale — tens of thousands of texts across multiple dimensions like sentiment, brand perception, and product attributes. Manual labeling was too slow and expensive. We needed an automated pipeline that could process batches reliably and scale to zero when idle.

## The Starting Point: spaCy for NER and Text Processing

Before any ML classification, we had a basic NLP layer built on **spaCy** — using transformer-based models (`en_core_web_trf`) for Named Entity Recognition and the large language model (`en_core_web_lg`) for tokenization, POS tagging, and lemmatization. This handled the fundamentals: extracting organization names, product mentions, and generating wordclouds from survey text.

But spaCy doesn't do multi-label classification out of the box. For that, we needed trained models and a serving infrastructure.

## Architecture: Lambda Orchestration + SageMaker Inference

The classification system was built around two AWS primitives: **Lambda** for orchestration and **SageMaker serverless endpoints** for model inference.

The Lambda function acted as a state machine, managing a multi-stage pipeline covering ingestion, translation, prediction, post-processing, and reporting.

SageMaker serverless endpoints gave us pay-per-invocation pricing without managing infrastructure. We deployed traditional ML models (trained separately) via the SageMaker Model Registry, with automatic endpoint updates when new model versions were approved.

## What Worked

- **Scale-to-zero economics** — no cost when idle, which mattered for batch workloads with unpredictable timing
- **Model registry integration** — clean separation between training and serving, with approval gates for production models
- **State machine pattern** — the Lambda function tracked progress through 13 pipeline stages, making it easy to resume after failures

## What Didn't

- **Cold start latency** — SageMaker serverless endpoints had significant cold starts (30-60 seconds), making real-time use impractical
- **Limited model flexibility** — deploying new model architectures required rebuilding the SageMaker container and endpoint configuration
- **Monitoring gaps** — tracking capacity and throughput across multiple serverless endpoints was harder than expected
- **Coupling** — the monolithic Lambda function grew complex as we added stages

## Key Takeaway

SageMaker serverless endpoints are a good fit for batch ML workloads where cold start latency is acceptable. For our use case, the architecture worked well initially but became a bottleneck as we needed faster iteration on models and more flexible inference. This pushed us toward the next iteration.

## Technical Stack

- AWS Lambda (Python) — pipeline orchestration
- AWS SageMaker Serverless Endpoints — model inference
- SageMaker Model Registry — model versioning and approval
- S3 — intermediate storage
- ECS Fargate — heavy compute tasks (wordcloud generation)
