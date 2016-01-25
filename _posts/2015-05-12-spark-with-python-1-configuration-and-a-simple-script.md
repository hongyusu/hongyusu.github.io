---
layout: post
title: "Spark with Python: configuration and a simple Python script"
description: ""
category: Technology
tags: [Spark, Python, BigData]
---
{% include JB/setup %}


<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>



## Configuration

For now, let's assume we have the Spark running in the background.
Configure a Spark-Python script to make it running on cluster seems to be straight forward.
For example, I would like to run a _logistic regression_ in machine learning toolbox with Python API.
The first thing I should do is to include some Python packages

{% highlight python%}
from pyspark.mllib.classification import LogisticRegressionWithSGD
from pyspark.mllib.regression import LabeledPoint
from numpy import array
from pyspark import SparkContext
from pyspark import SparkConf
{% endhighlight%} 

Then I have to configure my script with the followings

{% highlight python%}
APP_NAME = 'spark-python-lregression'
conf = SparkConf().setAppName(APP_NAME)
conf = conf.setMaster('spark://ukko178:7077')
sc = SparkContext(conf=conf)
{% endhighlight%}

The code above is the key to run a Spark-Python parallel, which is a bit different from running Spark-Scala script.
After the configuration, the only thing I have to do is to use machine learning Python API to perform the _logistic regress_ on some data.
The rest of the script is

{% highlight python%}
# Load and parse the data
def parsePoint(line):
    values = [float(x) for x in line.split(' ')]
    return LabeledPoint(values[0], values[1:])
sc = SparkContext(conf=conf)
data = sc.textFile("../spark-1.3.0-bin-hadoop2.4/data/mllib/sample_svm_data.txt")
parsedData = data.map(parsePoint)
# Build the model
model = LogisticRegressionWithSGD.train(parsedData)
# Evaluating the model on training data
labelsAndPreds = parsedData.map(lambda p: (p.label, model.predict(p.features)))
trainErr = labelsAndPreds.filter(lambda (v, p): v != p).count() / float(parsedData.count())
print("Training Error = " + str(trainErr))
{% endhighlight%}

##Submit the script to Spark

As I already mentioned that running this script is very simple.
In practice this can be done with the following command
{%highlight bash%}
../spark-1.3.0-bin-hadoop2.4/bin/spark-submit spark-python-lregression.py
{%endhighlight%} 

To make sure that the submitted Spark-Python Script is running on the cluster in parallel other than on the local machine, I would check the information of the submitted job in the administration website of the Spark.
In practice, this can be done with the command line browser `lynx`

{%highlight bash%}
lynx http://localhost:8080
{%endhighlight%}

As expected, the submitted job is completed and appears as

{%highlight bash%}
Completed Applications Application ID Name Cores Memory per Node Submitted Time User State Duration                                                                                                                                                 
app-20150512225125-0013 spark-python-svm 80 512.0 MB 2015/05/12 22:51:25 su FINISHED 29 s
{%endhighlight%}

For more information, I would recommend the [documentation](https://spark.apache.org/docs/latest/mllib-guide.html) of Spark machine learning API.


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






