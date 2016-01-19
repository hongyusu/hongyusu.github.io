---
layout: post
title: "Cool stuff in NIPS 2015 (workshop) - Optimization"
description: ""
category: Research
tags: [NIPS, Research, Optimization, MachineLearning]
---


{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>


![photo]({{site.url}}/myimages/ss_20160119_9.jpg)

 
# Table of content
* auto-gen TOC:
{:toc}

This blog post is about NIPS 2015 workshop of [Optimization](http://opt-ml.org/index.html).

# Invited talk on _An evolving gradient resampling method_

1. It would extremely helpful to have the slide of this presentation. But it is no where available.
1. Gradient update with high order information
   1. Momentum:
      ![photo1]({{site.url}}/myimages/ss_20160119_5.png)
      1. Simply adds a small fraction of previous gradient update to the current one.
      1. When gradient keeps changing direction, momentum will smooth out variances.
      1. Extremely useful when the optimization surface looks like a long narrow valley.
   1. Quasi newton method
1. Noise reduction
   1. Dynamic sampling
   1. Average gradient
1. There is transient behavior in gradient optimization
   1. Variance of gradient reveals the progress of the optimzation
   1. Therefore, we should aim at decreasing the variance of the gradient geometrically to achieve a exponential convergent rate.
1. Either, geometrically increase the sample size to compute the gradient
1. Or, proposed method: use angle information to compute the gradient :question:
   1. It is a transition from stochastic to batch gradient, gradient sampling
   1. There are papers available for more information :question:
   1. Ingredients of the method
      1. Stochastic gradient
      1. Sampling
      1. Batch gradient
      1. Different growth rate 


# Interesting convex optimization papers in the conference 

1. These papers more or less use second order information during the convex optimization 
   1. [Convergence rates of sub-sampled Newton methods](https://papers.nips.cc/paper/5918-convergence-rates-of-sub-sampled-newton-methods)
   1. [Newton-stein method: a second order method for GLMs via stein's lemma](https://papers.nips.cc/paper/5750-newton-stein-method-a-second-order-method-for-glms-via-steins-lemma)
   1. [Natural neural network](https://papers.nips.cc/paper/5953-natural-neural-networks)


# Other potential papers

1. [Logarithmic time online multiclass prediction]()
1. [Probabilistic line searches for stochastic optimization]()
1. [The human kernel]()
1. [Machine teaching workshop]()
1. [Calibrated structured prediction]()
1. [The Self-Normalized Estimator for Counterfactual Learning]()
1. [Competitive Distribution Estimation: Why is Good-Turing Good]()