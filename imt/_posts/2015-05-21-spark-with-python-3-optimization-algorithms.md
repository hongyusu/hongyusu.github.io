---
layout: imt-post
title: "Spark with Python: optimization algorithms"
description: ""
category: Technology
tags: [Spark, Python, Optimization]
---
Spark with Python: optimization algorithms


##Gradient methods in Spark MLlib Python API

The optimization problems introduced in [MLlib](https://spark.apache.org/docs/latest/mllib-optimization.html#update-schemes-for-distributed-sgd) are mostly solved by gradient based methods.
I will briefly present several gradient based methods as follows

###[Newton method](https://en.wikipedia.org/wiki/Newton%27s_method_in_optimization)

   - Newton method is developed originally to find the root $$f(x)=0$$ of a differentiable function $$f$$.
   - In the optimization problem where the goal is to maximize/minimize a function, Newton method is applied to find the stationary point $$f'(x)=0$$ of a twice differentiable function $$f$$. In other word, it finds the root of the derivative $$f'(x)$$.
   - Newton method is an iterative method. However, it will find the maxima/minima in one single iteration if the function $$f(x)$$ to be optimized is quadratic. This is because the method estimates a quadratic surface of $$f(x)$$ at any point $$x$$.
   - When work with high dimensional data, Newton method involves inverting a [_Heissian_ matrix](https://en.wikipedia.org/wiki/Hessian_matrix) which can be computationally expensive. This can be worked around with many [approaches](https://en.wikipedia.org/wiki/Newton%27s_method_in_optimization)

###[Gauss-Newton method](https://en.wikipedia.org/wiki/Gauss–Newton_algorithm)

   - [A nice short piece of text](http://www.value-at-risk.net/functions/) about _gradient_, _Heissian_, and _Jacobian_.
   - The method is used to minimize a sum of squared function values, e.g., non-linear least square problem

      $$f(x) = \sum_{i=1}^{n}f_i(x)^2$$

   - In particular, the _Heissian_ is approximated by ignoring the second order derivative term.

###[Quasi-Newton method](https://en.wikipedia.org/wiki/Quasi-Newton_method)

   - Searching for the root

      - Newton method aims to find the root of a function $$f(x)$$ by iterative update

         $$x_{n+1} = x_{n} - [J_f(x_n)]^{-1}f(x_n)$$

      - Methods that replace exact _Jacobian matrix_ $$J_f(x_n)$$ are Quasi-Newton methods, e.g., replacing $$J_f(x_n)$$ with $$J_f(x_0)$$.

   - Searching for the optima

      - This is similar to searching for the root where we are looking for the foot of the gradient. The _Jacobian_ matrix is replaced by _Heissian_ matrix. The proposed methods usually exploit the symmetric property of the _Heissian_ matrix.

      - The key idea is that the _Heissian_ matrix does not need to be inverted. Unlike Newton method which inverts _Heissian_ by solving a system of linear equation, the quasi-Newton methods usually directly estimate the inverted _Heissian_.

###[Stochastic gradient descent (SGD)]()
   - Stochastic gradient descent (SGD) where gradient is computed as the summation over a subset of examples (_minibatch_) located in RDD.

###[BFGS](https://en.wikipedia.org/wiki/Broyden–Fletcher–Goldfarb–Shanno_algorithm)

###[Limit-memory BFGS (L-BFGS)](https://en.wikipedia.org/wiki/Limited-memory_BFGS)
