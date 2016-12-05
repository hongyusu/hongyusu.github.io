---
layout: imt-post
title: "NIPS conference 2015"
description: ""
category: Research
tags: [NIPS]
---

Some experience in NIPS2015 conference.  



# Table of content
* auto-gen TOC:
{:toc}

# NIPS 2015

1. There seems to be an exponential growth for NIPS participants as shown in the following picture. It is said that about 10% papers are from deep learning and roughly 5% from convex optimization.
   ![photo1](/images/ss_20160119_6.png){:width="600"}

1. One big news in NIPS is that Elon Musk plan to commit 1 billion dollars to create a non-profit research organization known as [OpenAI](https://openai.com/blog/introducing-openai/). See also the [press release of the New York Times](http://www.nytimes.com/2015/12/12/science/artificial-intelligence-research-center-is-founded-by-silicon-valley-investors.html?hpw&rref=technology&action=click&pgtype=Homepage&module=well-region&region=bottom-well&WT.nav=bottom-well&_r=1). OpenAI will base in San Fransisco with a long term goal is to create an artificial general intelligence (AGI) that is capable of performing intellectual task as human beings. The funding for openAI is extremely high which makes people curious about what they are going to achieve after a few years.

   ![photo1](/images/ss_20160119_8.png){:width="600"}

   A researcher from OpenAI claims that the research will mostly be driven by empirical results rather than theory as they think in the field of neural network the empirical achievement is way ahead of the theory at the moment. At the same time, they don't restrict themselves on deep stuffs. 

1. A research startup [_the CurousAI company_](http://www.thecuriousaicompany.com/about/) based in Helsinki with partners from Aalto university and Nvidia. They have a paper in NIPS conference [semi-supervised learning with ladder networks](http://arxiv.org/abs/1507.02672) and a 300m [presentation](https://drive.google.com/file/d/0B5vNRvFfWLV9TjEteW4tYXJ4UWs/view?usp=sharing).

   ![photo1](/images/ss_20160119_7.png){:width="600"}

   Obviously, they only do stuffs in deep neural network.

1. My personal comment on these deep companies: I think deep learning involves more engineering work than scientific research. There is no problem for big company like Google and Facebook to invest money and brains for the purpose of making more money. Look at the funding member of both AI research companies, they are all deep learning people. AI or AGI are believed to be far more complicated than engineering. And I think deep learning is very premature to be a working horse of creating an AI or AGI. But throwing money to research is always a good sign :laughing:

# Workshops

1. [Non-convex optimization in machine learning](/research/2015/12/26/notes-from-nips-2015-workshop-of-non-convex-optimization-in-machine-learning/)

1. [Time series](/research/2015/12/25/notes-from-nips-time-series-workshop-2015/)

1. [Optimization](/research/2016/01/19/cool-stuff-in-nips-2015-workshop---optimization/)

# Symposiums

1. [Algorithm among us](/research/2016/01/19/cool-stuff-in-nips-2015-symposium-algorithm-among-us/)

1. [Neural style](/research/2016/01/05/cool-thing-in-nips-2016---neural-style/)


# Interesting conference papers

## Non-convex optimization

In general, non-convex optimization problems are NP-hard. One fundamental direction for non-convex optimization research is to extend the class of functions that one can solve efficiently

1. [Beyond convexity: stochastic quasi-convex optimization](https://papers.nips.cc/paper/5718-beyond-convexity-stochastic-quasi-convex-optimization)
   1. Convex Lipschitz functions can be minimized efficiently using stochastic gradient descent (SGD).
   1. Propose a stochastic version of Normalized gradient descent (NGD) and prove the convergence for a wide class of functions
      1. Quasi-convex
      1. Locally-Lipschitz

Another interesting direction on non-convex optimization is to develop efficient polynomial time algorithm for some specific optimization problems under some reasonable assumptions.

1. [Solving Random Quadratic Systems of Equations Is Nearly as Easy as Solving Linear Systems](https://papers.nips.cc/paper/5743-solving-random-quadratic-systems-of-equations-is-nearly-as-easy-as-solving-linear-systems)

   1. [Video](http://research.microsoft.com/apps/video/?id=259586) of the 20 mins oral presentation.
   1. The problem is finding a solution $$x$$ to a quadratic system of equations (non-linear)
         
         $$y_i = <a_i,x>^2,\quad i=1,\cdots, m$$.
   1. It is a non-convex optimization problem.
   1. Solving the quadratic system of equation is to find rank one solution based on a collection of linear constraints
      ![photo1](/images/ss_20160119_10.png){:width="600"}
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




## Convex optimization







# Others

1. [Data science in the next 50 years](/research/2015/12/31/data-science-in-the-next-50-years/)
