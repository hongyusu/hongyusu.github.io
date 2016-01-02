---
layout: post
title: "Data science in the next 50 years"
description: ""
category: Research 
tags: [Research]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}

# A short summary


The statistics and machine learning are philosophically different in which the former focuses on statistical inference trying to explain the test property of a random sample of population, while the latter focuses on making prediction even the prediction cannot be very well explained.

The cultural gap between statistical learning and machine learning is illustrated by the popularity of deep learning today, the success of which can be explained by the following three factors:

1. Much powerful computational infrastructure to scale up the computation e.g., GPU
1. Ability to own, collect, and process massive amounts of data to generate knowledge
1. Build a machine learning model with massive amounts of parameter and be able to learn these parameters with efficient algorithm e.g., SGD

As a result, the standard protocol or the paradigm in deep learning is to

1. Collect a massive amounts of data
1. Design a cost function to be minimized
1. Design a neural network architecture to minimize the cost function by performing SGD

There is no guarantee that SGD will drive the optimization converging to local minimal given a fixed training time of the deep neural network. This is because the objective function of the optimization problem is non-convex and possibly in high dimension. Thus, multiple local minimals exist and possibility with exponential number of saddle points in the optimization landscape. However, none of these stop deep learning being one of the best machine learning models nowadays in term of prediction power. 

It is worth noting that massive amount of parameters in deep neural network seem impossible to interpret. Uncertainty of prediction is difficult to quantify. This is opposite to the previous decade of research in probabilistic graphical models. 

The prediction for the future would be that the statistics and machine learning will continue to backup each other. Statistics needs to understand the value of massive amounts of data and starts to worry about data storage and computation. Despite the fact that some machine learning models (e.g., deep neural network) are difficult to interpret, we should accept that the real world is fairly complex. Perhaps the poor interpretability is the price we should pay for approaching complex phenomena with a complex model.
1. 








 

# Original writings by Max Welling

Original writing by Max Welling can be found from [here](http://www.ics.uci.edu/~welling/publications/papers/WhyMLneedsStatistics.pdf).