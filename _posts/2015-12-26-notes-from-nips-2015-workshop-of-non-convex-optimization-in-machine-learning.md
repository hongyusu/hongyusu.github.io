---
layout: post
title: "Notes from NIPS 2015 workshop of non convex optimization in machine learning"
description: ""
category: Research
tags: [NIPS2015, Research, Tensor, Nonconvex, Optimization]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}


# Workshop: [non-convex optimization in machine learning](https://sites.google.com/site/nips2015nonconvexoptimization/invited-speakers)

### Invited talk: Recent advances and challenges in non-convex optimization 

1. The talk mainly focuses on tensor decomposition as non-convex optimization problem. Keywords of the talk might be e.g., _tensor decomposition_, _non-convex optimization_, _spectrum optimization_, _robust PCA_.
1. [Slides of the talk](https://docs.google.com/viewer?a=v&pid=sites&srcid=ZGVmYXVsdGRvbWFpbnxuaXBzMjAxNW5vbmNvbnZleG9wdGltaXphdGlvbnxneDo0OGYxMDE2ZjFhNjlkNGRi).
1. Two related papers appearing in this workshop
   1. [Convolutional dictionary learning through tensor factorization](http://arxiv.org/abs/1506.03509)
   1. [Tensor vs matrix methods: robust tensor decomposition under block sparse perturbations](http://arxiv.org/abs/1510.04747)
1. Non-convex optimization is a trending research area compare to convex optimization.
1. Non-convex optimization and _Curse of dimensionality_
   1. Difficulty in convex optimization: multiple optimality exist.
   1. _Curse of dimensionality_ is the concept we all come across during the introductory course of machine learning but easily forget afterwords. As a short summary, it actually means
      1. The volume of the space increases very quickly when the dimensionality increases such that available data become very sparse.
      1. In order to have statistical significancy, the number of data points required to support the results in the space will grow exponentially with the dimensionality.
      1. High-dimensionality might not always be good, people like me frequently use dimensionality reduction techniques, e.g., [principal component analysis (PCA)](https://en.wikipedia.org/wiki/Principal_component_analysis) to reduce dimension while keeping the similar amount of useful information.
   1. **I still need to find out the relation of _curse of dimensionality_ and _anomaly detection_.**
   1. In optimization, _curse of dimensionality_ means exponential number of crucial points (saddle points of which the gradient is zero). 
1. Spectrum optimization
   1. **Eigen-decomposition** of a matrix can be formulate as the following convex optimization problem (for the top eigen-value)
   $$\underset{v}{\max}\,<v,Mv>\, \text{s.t.}\, ||v||=1,v\in\mathbb{R}^d$$
   1. **Tensor decomposition**: given an input tensor $$T=L+S$$, we aim to recover both $$L$$ and $$S$$, where $$L$$ is a rank $$r$$ orthogonal tensor and $$S$$ is a sparse tensor. In particular, $$L$$ has the form $$L = \sum_{i=1}^{r}\delta_iu_i\otimes u_i \otimes u_i$$. This is non-convex optimization problem.
   1. **Robust PCA**: is the same as tensor decomposition but in a matrix form. This can be formulated either as a convex or non-convex optimization problem.
1. The talk suggests two algorithm for tensor decomposition. One for orthogonal tensor decomposition problem and the other for non-orthogonal tensor decomposition problem.
1. A list of implementation is also provided as in the slides, which also includes spark implementation. **Need to checkout the performance**. However, in the paper they mentioned that the underlying optimization algorithm is _embarrassingly parallel_. 
1. She also gave some similar talks about non-convex optimization and tensor decomposition
   1. [Tensor methods for training neural networks](https://www.youtube.com/watch?v=B4YvhcGaafw)
   1. [Beating the perils of non-convexity machine learning using tensor methods](https://www.youtube.com/watch?v=YpnlAQTY1Mc)
1. Other interesting material about tensor decomposition
   1. [Open problems in tensor decomposition](https://www.quora.com/Matrix-Decomposition/What-are-some-open-problems-in-Tensor-analysis)
   1. [Most tensor problems are NP-hard](http://www.stat.uchicago.edu/~lekheng/work/jacm.pdf). Quoted from this paper _' "Bernd Sturmfels once made the remark to us that “All interesting problems are NP-hard.” In light of this, we would like to view our article as evidence that most tensor problems are interesting."'_





