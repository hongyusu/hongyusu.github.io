---
layout: post
title: "Data science in the next 50 years - are machine learning and statistics complementary?"
description: ""
category: Research 
tags: [NIPS]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>


<iframe src="https://onedrive.live.com/embed?cid=C8F22FB4EF2311AF&resid=C8F22FB4EF2311AF%2132210&authkey=AJDVDDc5-wB71d4" width="240" height="320" frameborder="0" scrolling="no"></iframe>


# Table of content
* auto-gen TOC:
{:toc}

The following is a brief/summary of the note _'Are ML and Statistics Complementary?'_ by Max Welling.

# A brief summary

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

Statistics and machine learning will continue to backup each other

1. Statistics needs to understand the value of massive amounts of data and starts to worry about data storage and computation. Despite the fact that some machine learning models (e.g., deep neural network) are difficult to interpret, we should accept the fact that the real world is fairly complex. Perhaps the poor interpretability is the price we should pay for approaching complex phenomena with a complex model. 
1. In some problems where expert knowledge is heavily emphasised, statistics and machine learning will converge nicely as massive variables all have some semantic meaning and intensive computation is required and needs to be carefully allocated to reach the most important variables. 
1. In addition, machine learning will adopt some of the statistical models and principals to make a machine learning model easy to interpret, quantify the uncertainty, and balance between exploitation and exploration. In the end, the ultimate goal of machine learning is to serve and to interact people. Therefore, machine learning needs statistical paradigm to interact with human, to explain how to interpret the model, to quantify the uncertainty, and to generate probability.

There are some interesting directions for machine learning

1. Fair decision.
1. Identifying and removing sample bias.
1. Privacy preserved prediction.
1. Identify causation from correlation.
1. Learning in high dimensional space.


# Original writings by Max Welling

Original writing by Max Welling can be found from [here](http://www.ics.uci.edu/~welling/publications/papers/WhyMLneedsStatistics.pdf).