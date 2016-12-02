---
layout: imt-post
title: "Cool stuff in NIPS 2015 (workshop) - Time series"
description: ""
category: Research
tags: [NIPS, TimeSeries]
---

This post is about NIPS [time series workshop 2015](https://sites.google.com/site/nipsts2015/home).


# Table of content
* auto-gen TOC:
{:toc}



# Invited talk by Mehryar Mohri on _learning guarantee on time series prediction_

1. It would be nice to have his slide. But I don't have them here. You can have a look at the addition reading materials listed below.
1. The talk is mostly about a data driven learning bound (learning guarantee) for non-stationary non-mixing stochastic process (time series).

## Introduction and problem formation

1. Classical learning scenario: receive a sample $$(x_1,y_1),\cdots,(x_m,y_m)$$ drawn i.i.d. from a unknown distribution $$D$$, forecast the label $$y_0$$ of an example $$x_0$$, $$(x_0,y_0)\in D$$.
1. Time series prediction problem: receive a realization of a stochastic process $$(x_1,x_2,\cdots,x_T)$$, forecast the next value $$X_{T+1}$$ at time point $$T+1$$.
1. Two standard assumptions in current time series prediction models
   1. **Stationary** assumption: samples for a fixed sliding window (time period) follow the same distribution.
   1. **Mixing** assumption: dependency between samples of two time points decays fast along time.
   ![photo1](/images/ss_20160118_0.jpg)
1. These two assumptions seem to be natural and widely adopted in the machine learning community for time series prediction. *check the video for a collection of literatures supporting this argument*.
1. However, these two assumptions are somehow wrong:
   1. Consider only the distribution of the samples, ignore the learning problem.
   1. These two assumptions are not testable.
   1. Often they are not valid assumptions.
1. Examples:
   1. Long memory processes might not be mixing, autoregressive integrated moving average (ARIMA), autoregressive moving average (ARMA) 
   1. Markov process are not stationary
   1. Most stochastic process with a trend, a periodic component, or seasonal pattern are not stationary.
1. Now the question is whether it is possible to learn these time series or stochastic processes.

## Model

1. Robust learning models which do not make these strong/wrong assumptions are required for time series learning problems.
1. What is a suitable loss function for time series prediction?
   1. Not generalization error	
      1. $$R(h) = \underset{x}{E}[L(h,x)]$$.
      1. Generalization error captures the loss of a hypothesis $$h$$ over a collection of unseen data.
   1. Introduce pass dependent loss
      1. $$R(h,x^T) = \underset{x_{T+s}}{E} [L(h,x_{T+s}) \| x^T]$$.
      1. Seek for a hypotheses that has the smallest expected loss in the near future condition on the current observations.
1. How to analyze pass dependency loss function with the only assumption that can be potentially valid. Two ingredients:
   1. Expected sequential covering numbers
   1. Discrepancy measure:
      1. $$\Delta = \underset{h\in H}{sup}\left|R(h,X^T)-\frac{1}{T}\sum_{t=1}^{T}R(h,X^{t-1})\right|$$
      1. Maximum possible difference between generalization error in the near future and the generalization error we actually observed. **Measure the non-stationarity**.
      1. Discrepancy is difficult to capture. An estimation is used.  
1. Propose a learning guarantees/bound for time series prediction. 
   1. $$R(h,x^T) \le \frac{1}{T}\sum_{t=1}^{T}L(h,x_t) + \Delta + \sqrt{\frac{8log\frac{N}{delta}}{T}}$$
   1. This bound is essentially the same as classical learning bound based on i.i.d assumption except for an additional term describing the discrepancy. 
1. Minimize the error bound - convex optimization problem.

## Additional reading materials

1. The following two papers published in NIPS conference this year might be worth checking out
   1. [*Learning Theory and Algorithms for Forecasting Non-stationary Time Series*](http://papers.nips.cc/paper/5836-learning-theory-and-algorithms-for-forecasting-non-stationary-time-series.pdf).
   1. [*Revenue Optimization against Strategic Buyers*](http://papers.nips.cc/paper/6026-revenue-optimization-against-strategic-buyers.pdf).
1. There is also a talk in NIPS 2015 conference about the time series prediction presented by Vitaly Kuznetsov joint work with Mehryar Mohri [link to the video](http://research.microsoft.com/apps/video/?id=259620).

# Panel discussion on _modern challenges in time series analysis_

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
