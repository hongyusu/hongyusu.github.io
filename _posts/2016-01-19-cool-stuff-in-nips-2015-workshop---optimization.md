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


<iframe src="https://onedrive.live.com/embed?cid=C8F22FB4EF2311AF&resid=C8F22FB4EF2311AF%2132210&authkey=AJDVDDc5-wB71d4" width="240" height="320" frameborder="0" scrolling="no"></iframe>

 
# Table of content
* auto-gen TOC:
{:toc}

This blog post is about NIPS 2015 workshop of [Optimization](http://opt-ml.org/index.html).

# Invited talk on _An evolving gradient resampling method_

1. It would extremely helpful to have the slide of this presentation. But it is no where available.
1. Some introduction of gradient method
   1. Second order information
      1. momentum
      1. Quasi newton method
   1. Noise reduction
      1. Dynamic sampling
      1. Aggregate gradient
1. There is transient behavior in gradient optimization
   1. Variance of gradient reveals the progress of the optimzation
   1. Therefore, we should aim at decreasing the variance of the gradient geometrically
1. Geometrically increase the sample size to compute the gradient
1. Proposed method: use angle information to compute the gradient :questions:
   1. It is a transition from stochastic to batch gradient, gradient sampling
   1. There are papers available for more information :questions:
   1. Ingredient of the method
      1. Stochastic gradient
      1. Sampling
      1. Batch gradient
      1. Different growth rate 
