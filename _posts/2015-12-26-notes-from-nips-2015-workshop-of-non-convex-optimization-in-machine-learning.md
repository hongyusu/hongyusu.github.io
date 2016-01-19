---
layout: post
title: "Cool stuff in NIPS 2015 (workshop) - Non-convex optimization in machine learning"
description: ""
category: Research
tags: [NIPS, Research, Tensor, Nonconvex, Optimization, MachineLearning]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 

![photo]({{site.url}}/myimages/ss_20160119_9.jpg)


# Table of content
* auto-gen TOC:
{:toc}


"When I am a grown-up I want to do non-convex optimization". This blog post is about NIPS 2015 workshop of [non-convex optimization in machine learning](https://sites.google.com/site/nips2015nonconvexoptimization/invited-speakers) and some interesting papers on non-convex optimization appeared in the NIPS conference. 






# Invited talk on _Recent advances and challenges in non-convex optimization_

## Short summary

1. This invited talk is mostly about approaching some non-convex optimization problem via tensor decomposition or tensor algebra. 
1. As many real-world big-data optimization problem are statistically and computationally hard for which
   1. we need large number of examples in order to estimate the model.
   1. we need to tackle the non-convexity in order to achieve computational feasibility.
1. For example, solving these problem with stochastic gradient descent (SGD) with multiple random initialization will generally give very poor results due to multiple local optimals. 
1. On the other hand, some of these hard optimization problems can be formulated as the tensor decomposition or via tensor algebra.
1. **Then there are two strong claims about this tensor decomposition:**
   1. Though most tensor decomposition problems are also non-convex and NP-hard, running SGD will provide some satisfactory optimization results.
   1. We can converge to global optimal solution despite we have a non-convex optimization problem via tensor decomposition.
1. Theses two claims from the speaker are quite strong, it might be worthwhile to check the original publications.
1. Keywords of the talk might be e.g., _tensor decomposition_, _non-convex optimization_, _spectral optimization_, _robust PCA_.




## Introduction

1. Learning is like finding needle in a haystack.
   1. Big data is challenging due to large number of variables and high-dimensionalities.
   1. Useful information is essentially represented as some low-dimensional structure.
   1. Problem when learning with big data:
      1. Statistically: large number of examples are needed in order to estimate the model.
      1. Computationally: mainly about non-convexity, a lot of SGD restarts are required to avoid local optimals and to reach global optimal.
   1. Algorithm should scale both to the number of samples and variables.

1. Optimization for learning
   1. Unsupervised learning: maximize similarity of cluster, maximize likelihood of model.
   1. Supervised learning: minimize some cost function.
   1. Most of them are non-convex optimization problem.
   1. A [Facebook page](https://www.facebook.com/nonconvex) for non-convex optimization.
   1. Convex has a unique global optimal solution, SGD will lead to the unique global optimal.
   1. Non-convex has multiple local optimal, possibly exponential local optimals in high dimensional space. This makes large scale learning challenging.

1. Non-convex optimization is a trending research area compare to convex optimization.

   ![photo1]({{ site.url}}/myimages/ss_201601-9_0.png)

1. Non-convex optimization and _Curse of dimensionality_
   1. Difficulty in non-convex optimization: multiple optimalities exist.
   1. _Curse of dimensionality_ is the concept we all come across during the introductory course of machine learning but easily forget afterwords. As a short summary, it actually means
      1. The volume of the space increases very quickly when the dimensionality increases such that available data become very sparse.
      1. In order to have statistical significancy, the number of data points required to support the results in the space will grow exponentially with the dimensionality.
      1. High-dimensionality might not always be good, we frequently use dimensionality reduction techniques, e.g., [principal component analysis (PCA)](https://en.wikipedia.org/wiki/Principal_component_analysis) to reduce dimension while keeping the similar amount of useful information.
   1. **I still need to find out the relation of _curse of dimensionality_ and _anomaly detection_.**
   1. **In optimization, _curse of dimensionality_ means exponential number of crucial points (saddle points of which the gradient is zero).** 

1. Method in one sentence: model the optimization problem with tensor algebra, run SGD for non-convex tensor decomposition problems.

## Methods

1. Take data as a tensor object
   1. Matrix view: pairwise correlation.
   1. Tensor view: high order correlation.

1. Spectral decomposition
   1. Look at matrix decomposition and tensor decomposition
      1. Matrix decomposition: $$M_2 = \sum_{i=1}^{r}\lambda_i u_i\otimes v_i$$.
      1. Tensor decomposition: $$M_3 = \sum_{i=1}^{r}\lambda_i u_i\otimes v_i \otimes w_i$$.
      1. This is the problem under study here in this talk. The goal is to solve this efficiently and with some good result in term of optimization quality. Essentially, they are non-convex optimization problem.
   1. **Singular value decomposition (SVD)**
      1. SVD of a 2D matrix can be formulate as the following convex optimization problem (calculating the first eigen-value) 
      $$\underset{v}{\max}\,<v,Mv>\, \text{s.t.}\, ||v||=1,v\in\mathbb{R}^d$$.
      1. With all eigen-values computed, SVD can be seen as, e.g., decomposing a document-word matrix into a document-topic matrix, a topic strength matrix, and a topic-word matrix.
   1. SVD and tensor decomposition
   ![photo1]({{site.url}}/myimages/ss_20160119_1.png)
   ![photo1]({{site.url}}/myimages/ss_20160119_2.png)
   1. **Principal component analysis (PCA)** is an important application of SVD which finds new axises of a data cloud that explains the variance in the data. 
   1. **Tucker decomposition**: 
      1. Given an input tensor as a $$I\times J\times K$$ matrix $$X$$, decompose it into a $$I\times R$$ matrix $$A$$, a $$J\times S$$ matrix $$B$$, a $$K\times T$$ matrix $$C$$, and a $$R\times S \times T$$ diagonal matrix $$G$$.
      1. This is a non-convex problem and can be solved approximately by _alternating least square (ALS)_.
   1. **Canonical decomposition (CANDECOMP) or Parallel factor (PARAFAC)**: 
      ![photo1]({{site.url}}/myimages/ss_20160119_3.png)
      1. Given an input tensor as a $$I\times J\times K$$ matrix $$X$$, decompose it into a $$I\times R$$ matrix $$A$$, a $$J\times R$$ matrix $$B$$, a $$K\times R$$ matrix $$C$$, and a $$R\times R \times R$$ diagonal matrix $$G$$.
      1. This is almost the same as Tucker decomposition. It is a non-convex problem and is solved by ALS.
   1. **Robust tensor decomposition**: given an input tensor (3D matrix) $$T=L+S$$, we aim to recover both $$L$$ and $$S$$, where $$L$$ is a rank $$r$$ orthogonal tensor and $$S$$ is a sparse tensor. In particular, $$L$$ has the form $$L = \sum_{i=1}^{r}\delta_iu_i\otimes u_i \otimes u_i$$. This is non-convex optimization problem.
   1. **Robust PCA**: is the same as tensor decomposition but in a matrix form. This can be formulated either as a convex or non-convex optimization problem.

1. The talk suggests two algorithm for tensor decomposition:
   1. One for orthogonal tensor decomposition problem.
   1. The other for non-orthogonal tensor decomposition problem.

## Implementation and applications

1. A list of implementation is also provided as in the slides, which also includes [this spark implementation](https://github.com/FurongHuang/SpectralLDA-TensorSpark). **Need to checkout the performance**. In [this paper](http://arxiv.org/abs/1506.03509) they mentioned that the underlying optimization algorithm is _embarrassingly parallel_. So looks promising :question: 

1. Other interesting tensor decomposition: **dynamic tensor decomposition**, **streaming tensor decomposition**, and **window based tensor analysis**.

1. Applications of tensor analysis
   1. Unsupervised learning: GMM, HMM, ICA, topic model (not very clear).
   1. Training deep neural network, back-propagation  has highly non-convex loss surface, tensor training has better loss surface.
   1. Sensor network analysis as a location-type-time tensor.
   1. Social network analysis as a author-keyword-time tensor.

## Other information


1. Loss function in deep neural network looks like random Gaussian polynomial.
   1. The main result is that all local minimals have similar values.
   1. Exponential number of saddle points which is difficult to escape.

1. To avoid saddle points
   1. Use second order information: Hessian matrix.
   1. Use noisy stochastic gradient.
   1. Compute a convex envelop.
   1. Smooth out the non-convex function.


## Additional materials
1. [Slide](https://docs.google.com/viewer?a=v&pid=sites&srcid=ZGVmYXVsdGRvbWFpbnxuaXBzMjAxNW5vbmNvbnZleG9wdGltaXphdGlvbnxneDo0OGYxMDE2ZjFhNjlkNGRi) for the talk.

1. Two related papers from her research group that appears in this workshop
   1. [Convolutional dictionary learning through tensor factorization](http://arxiv.org/abs/1506.03509)
   1. [Tensor vs matrix methods: robust tensor decomposition under block sparse perturbations](http://arxiv.org/abs/1510.04747)

1. She also gave some similar talks about non-convex optimization and tensor decomposition
   1. [Tensor methods for training neural networks](https://www.youtube.com/watch?v=B4YvhcGaafw).
   1. [Beating the perils of non-convexity machine learning using tensor methods](https://www.youtube.com/watch?v=YpnlAQTY1Mc).
   1. [Tensor methods: a new paradigm for training probabilistic models and for feature learning](https://www.youtube.com/watch?v=B4YvhcGaafw).

1. Other interesting materials about tensor decomposition
   1. [Quora: Open problems in tensor decomposition](https://www.quora.com/Matrix-Decomposition/What-are-some-open-problems-in-Tensor-analysis).
   1. [Paper: Most tensor problems are NP-hard](http://www.stat.uchicago.edu/~lekheng/work/jacm.pdf). Quoted from this paper _' "Bernd Sturmfels once made the remark to us that “All interesting problems are NP-hard.” In light of this, we would like to view our article as evidence that most tensor problems are interesting."'_
   1. [Tutorial: Mining Large Time-evolving Data Using Matrix and Tensor Tools ](http://www.cs.cmu.edu/~christos/TALKS/SIGMOD-07-tutorial/).




# Invited talk on _Large-scale optimization for deep learning_

There is a very interesting point in this talk: it is relatively easier to optimize a very large neural network on a small machine learning problem.

![photo1]({{site.url}}/myimages/ss_20160119_4.png)


# Interesting non-convex optimization papers in the conference

1. In general, non-convex optimization problems are NP-hard. One interesting direction on non-convex optimization is to develop efficient polynomial time algorithm for some specific optimization problems under some reasonable assumptions.

   1. [Solving Random Quadratic Systems of Equations Is Nearly as Easy as Solving Linear Systems](https://papers.nips.cc/paper/5743-solving-random-quadratic-systems-of-equations-is-nearly-as-easy-as-solving-linear-systems)

      1. [Video](http://research.microsoft.com/apps/video/?id=259586) of the 20 mins oral presentation.
      1. The problem is finding a solution $$x$$ to a quadratic system of equations (non-linear)
         
         $$y_i = <a_i,x>^2,\quad i=1,\cdots, m$$.
      1. It is a non-convex optimization problem.
      1. Solving the quadratic system of equation is to find rank one solution based on a collection of linear constraints
         ![photo1]({{ site.url }}/myimages/ss_20160119_10.png).
         Therefore, it is similar as low rank matrix estimation.
      1. The paper is saying that a quadratic system equations with $$n$$ variables can be solved in $$\Theta(n)$$.
      1. The key ingredients:
         1. Assumption: 
            1. Unstructured random system $$A$$ is a random matrix i.i.d.
            1. This is not very strong, can be well beyond i.i.d. model, as long as there is some non-coherence information.
         1. Stage 1: regularized spectral intialization procedure.
         1. Stage 2: regularized iterative descend procedure :question: geometric convergent rate.
      1. Basically, the gradient descent with spectral initialization can work in non-convex optimization problem. Evidence can also be found from this paper [A nonconvex optimization framework for low rank matrix estimation](https://papers.nips.cc/paper/5733-a-nonconvex-optimization-framework-for-low-rank-matrix-estimation)
      1. **Empirically, the speed of the proposed algorithm solving quadratic system of equations is about four times of solving a least square problem of the same size.**

   1. [A Nonconvex Optimization Framework for Low Rank Matrix Estimation](https://papers.nips.cc/paper/5733-a-nonconvex-optimization-framework-for-low-rank-matrix-estimation)
      1. The problem under study is low rank matrix estimation via non-convex optimization.
      1. Compared to convex relaxation, non-convex approach has superior empirical performance (this claim comes from this paper).
      1. Propose an optimization algorithm called _projected oracle divergence_.
      1. Prove the convergence to global optima for e.g., alternating optimization and gradient-type method for non-convex low rank matrix estimation.
      1. The optimization algorithm has geometric convergence rate.

   1. [A Convergent Gradient Descent Algorithm for Rank Minimization and Semidefinite Programming from Random Linear Measurements](https://papers.nips.cc/paper/5830-a-convergent-gradient-descent-algorithm-for-rank-minimization-and-semidefinite-programming-from-random-linear-measurements)
      1. A simple, scalable, and fast gradient descent algorithm for non-convex optimization of affine rank minimization problem.

         $$\underset{X\in R^{n\times p}}{\min}rank(X), \quad \text{subject to}\, A(X)=b$$
      1. The rank minimization problem can be written as a particular class of SDP problem, the proposed method offer a fast solution for SDP compare to interior point methods.
      1. The key ingredient is that the low rank minmization problem is conditioned on the transformation $$A:R^{n\times p}\rightarrow R^m$$.
      1. The proposed gradient algorithm has a **Linear convergence rate**.

1. Another direction seems to me more fundamental which is to extend the class of functions that one can solve efficiently

   1. [Beyond convexity: stochastic quasi-convex optimization](https://papers.nips.cc/paper/5718-beyond-convexity-stochastic-quasi-convex-optimization)
      1. Convex Lipschitz functions can be minimized efficiently using stochastic gradient descent (SGD).
      1. Propose a stochastic version of Normalized gradient descent (NGD) and prove the convergence for a wide class of functions
         1. Quasi-convex and locally-Lipschitz











































