---
layout: post
title: "Cool stuff in NIPS 2015 (workshop) - Time series"
description: ""
category: Research
tags: [NIPS, Research, TimeSeries]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}


This post is about NIPS [time series workshop 2015](https://sites.google.com/site/nipsts2015/home).

# Invited talk by Mehryar Mohri

1. It might be interesting to have his slide. I don't have it here yet.
1. Introduce path dependent loss function.
1. Wrong assumptions in the previous time series prediction models
   1. Stationary assumption, samples for a fixed time period follow the same distribution.
   1. Mixing assumption, dependency decrease along time.
1. Learning model is required without these assumptions.
1. The only assumption that can be potentially valid: introducing the loss dependency assumption.
1. Introduce the concept of discrepancy in time series model.
1. Build a learning bound for time series with loss dependency assumption. This bound is essentially the same as classical learning bound based on i.i.d assumption except for an additional term describing the discrepancy. 
1. The following two papers published in NIPS conference this year might be worth checking out
   1. [*Learning Theory and Algorithms for Forecasting Non-stationary Time Series*](http://papers.nips.cc/paper/5836-learning-theory-and-algorithms-for-forecasting-non-stationary-time-series.pdf)
   1. [*Revenue Optimization against Strategic Buyers*](http://papers.nips.cc/paper/6026-revenue-optimization-against-strategic-buyers.pdf)

# Time series workshop panel discussion

1. Algorithm that is able to learn from other time series, something like transductive learning.
1. Algorithm for time series prediction in the case where there are only a few data points.
1. Time series prediction also considering other factors. For example, shopping history of a particular user enables the prediction of purchase of the next time point. How about we observe/predict at the same time this particular user is expecting a baby. Add other contextual information into time series prediction.
1. Time series prediction in high frequency trading, frequency increase from a millisecond to a nanosecond.
1. Heterogeneous data sources, fusion of a variety of time series data.
1. Algorithm to tackle large scale time series data or very small time series data.
1. Time series model in finance
   1. Finance modeling and high frequency trading.
   1. Different stock trade centre use different option matching mechanism.
   1. Structural heterogeneity in the financial  data should be addressed to understand the price, volume, etc of stocks in the exchange market.
1. Output a confident interval for prediction is very important in developing machine leaning models by Cortes.
1. Why deep learning is not used in financial data by Cortes
   1. It is difficult to update a deep learning model vs. financial data is essential online.
   1. Financial data is very noisy, nonlinear model will overfit the training data. On the other hand, linear model with regularization seems to be a better alternative.
