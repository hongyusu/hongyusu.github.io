---
title: "Predicting Product Launch Success with Machine Learning"
tags: [ML, XGBoost, Metaflow, SHAP, ProductAnalytics, MLOps]
description: "How we built a predictive analytics system that forecasts product launch performance from consumer survey data — training pipeline, feature engineering, and real-time inference."
---

## The Problem

Before a consumer goods company launches a new product, they run concept testing surveys. Hundreds of consumers evaluate the product concept across dimensions like taste appeal, packaging attractiveness, price perception, and purchase intent. The question: **will this product succeed in market?**

We built a system that takes these survey responses and predicts the product's likely sales performance — expressed as a percentile ranking against historical launches in the same category. A score of 80 means the concept is predicted to outperform 80% of similar product launches.

## What Makes This Hard

This isn't a standard regression problem. The challenges:

**Small datasets.** Each organization might have 10-100 historical product launches with known outcomes. You're training ML models on dozens of samples, not millions.

**High-dimensional inputs.** A single survey produces 100+ features: structured ratings (appearance, taste, quality), NLP-derived labels from open-ended text (sentiment, believability, differentiation), KPI metrics (willingness-to-buy, uniqueness), and product attributes (category, region, price tier).

**Multi-client, multi-category.** The system serves many organizations across food, beverages, personal care, and other categories. Each has different baselines, survey formats, and success metrics.

**Explainability is mandatory.** A prediction alone isn't useful. Clients need to know *why* — which drivers are pushing the score up or down, and what to improve.

## Architecture

```
Survey Data (Data Lake / Athena)
    ↓
Training Pipeline (Metaflow + AWS Batch)
    ↓  Optuna hyperparameter tuning
    ↓  20-fold cross-validation
    ↓  SHAP explainability
    ↓
Model Registry (MLflow)
    ↓  Tag-based version management
    ↓
Inference Lambda (AWS)
    ↓  Multi-level model routing
    ↓
Prediction + Drivers (JSON)
```

## Feature Engineering: From Surveys to Drivers

The raw survey data is transformed through a multi-step sklearn pipeline before it reaches the model. The key transformation: mapping 100+ raw features into **9 strategic drivers** that business users understand.

**Example drivers** include categories like taste appeal, packaging perception, purchase intent, and product differentiation — groupings that business stakeholders can act on directly.

Each raw feature maps to exactly one driver. This mapping is defined in code and applies consistently across training and inference.

**Statistical features:**
- **Beta-medians** — Bayesian aggregation of Likert-scale responses (handles small sample sizes better than raw means)
- **Wilson scores** — Confidence-interval adjusted sentiment metrics
- **KPI ratios** — Willingness-to-buy and uniqueness normalized against category benchmarks
- **Z-scores** — Benchmark comparisons with statistical significance

## The Model: Constrained XGBoost

We use **XGBoost regression** with two important constraints:

**Driver interaction constraints.** By default, XGBoost can learn arbitrary feature interactions. But a taste feature interacting with an appearance feature doesn't make business sense — it produces unexplainable predictions. We constrain the model so features can only interact within their driver group.

**Monotonic constraints.** Higher taste scores should never *decrease* the prediction. We enforce directional relationships where the business logic is clear (positive sentiment → higher score).

These constraints slightly reduce raw accuracy but dramatically improve interpretability and client trust.

## Hyperparameter Tuning with Optuna

With small datasets, hyperparameter choices matter enormously. We use **Optuna's Bayesian optimization** to tune:

- XGBoost parameters (depth, learning rate, regularization, number of estimators)
- Feature selection thresholds (which NLP features to include)
- Organization weighting (how much to emphasize specific clients)
- Low-variance feature dropping thresholds

All tuning uses **20-fold cross-validation** — aggressive given the dataset sizes, but necessary for stable performance estimates when you have 50 training samples.

## Two Explainability Strategies

### SHAP (SHapley Additive exPlanations)

For detailed analysis, we compute TreeSHAP values for every prediction. This gives the exact contribution of each feature to the score. We aggregate SHAP values by driver to produce the business-level explanation: "Taste is driving +12 points, but Value Perception is dragging -8 points."

Quality checks catch direction violations — if SHAP says higher taste hurts the score, something's wrong with the model or data.

### Proportional Drivers

For real-time inference where SHAP computation would add latency, we use a simpler approach: proportionally allocate the willingness-to-buy and uniqueness scores across drivers based on their underlying feature values. This is faster, more stable, and directly interpretable.

## Multi-Level Model Routing

Not every prediction uses the same model. The inference Lambda implements **priority-based routing**:

1. **Subcategory model** — most specific, if available
2. **Organization model** — client-specific model
3. **Category model** — broader category model
4. **General model** — fallback trained on all data

This is implemented through MLflow model tags. Each model version is tagged with its business dimensions. The Lambda queries for the most specific matching model.

## Training Pipeline: Metaflow

The training pipeline runs on **Metaflow** with AWS Batch for distributed computation:

1. **Preprocess** — Query Athena data lake, apply feature engineering, validate data quality
2. **Tune** — Optuna hyperparameter search (configurable trials, parallel evaluation)
3. **Train** — Fit final model with best parameters, compute training metrics
4. **Analyze** — SHAP explainability, driver impact analysis, residual diagnostics, generate plots
5. **Register** — Push model to MLflow with tags and benchmark data

Each step is containerized and reproducible. The pipeline produces a complete audit trail: which data was used, which parameters were tuned, what the cross-validation scores looked like, and which features made the cut.

## Infrastructure

- **Training**: Metaflow + AWS Batch
- **Inference**: AWS Lambda (VPC-connected)
- **Model Registry**: MLflow on dedicated service (cross-account IAM)
- **Data**: Athena queries on S3 data lake
- **IaC**: Pulumi (TypeScript) for all AWS resources
- **CI/CD**: GitHub Actions with Ruff, Mypy, Pytest, SonarQube gates

## Lessons Learned

**Small data requires strong priors.** With 50 training samples, every modeling decision matters. Feature engineering, constraints, and cross-validation strategy are more important than model architecture.

**Explainability builds trust.** The SHAP driver breakdown is the most-used feature. Clients don't just want a number — they want to understand the levers they can pull.

**Multi-client ML is a versioning problem.** Managing many model versions across organizations, categories, and environments requires disciplined tagging and routing. MLflow's tag system made this manageable.

**Preprocessing is the model.** The sklearn pipeline does more heavy lifting than XGBoost itself. Beta-medians, Wilson scores, and driver mappings encode domain knowledge that no amount of gradient boosting can learn from 50 samples.

## Technical Stack

- XGBoost — gradient boosted regression with constraints
- Metaflow — training pipeline orchestration
- Optuna — Bayesian hyperparameter optimization
- SHAP — model explainability (TreeExplainer)
- MLflow — model registry and experiment tracking
- AWS Lambda — real-time inference
- AWS Batch — distributed training compute
- Athena — data lake queries
- Pulumi — infrastructure as code
- sklearn — custom preprocessing pipeline
