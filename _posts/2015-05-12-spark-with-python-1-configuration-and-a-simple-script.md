---
layout: post
title: "Spark with Python (1): configuration and a simple script"
description: ""
category: Programming
tags: [Introduction, Programming, Spark, Python, BigData]
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


##Gradient methods in Spark-Python machine learning API

The convex optimization problem is solved in [MLlib](https://spark.apache.org/docs/latest/mllib-optimization.html#update-schemes-for-distributed-sgd) include
   
   -. Stochastic gradient descent
   -. Limit-memory BFGS





