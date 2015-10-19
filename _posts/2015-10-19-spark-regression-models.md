---
layout: post
title: "Spark regression models"
description: ""
category: Programming
tags: [Spark, Regression]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}


# System and experiment settings

- Spark is running on a cluster of 1 master node 14 slave nodes. Each node is a work station with 16 x E5540@2.53GHz CPU and 32G memory.
- Dataset used in the following regression experiment is the well-known [cadata](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cadata) data available from LibSVM website.
- In particular, the data file is in `libsvm` format. It is a sparse feature representation which can be naturally handled/loaded by a Spark Python function.
- In order to train a regression model and test it performance, we split the original dataset into training set and test set. More specifically, we sample 80% of examples uniformly at random to form a training set for learning a regression model, and sample 20% of the examples to form a test set which is used to test the performance of the constructed model.
- The statistics of the dataset is shown in the following table.

  |Category|Size|
  |:--|--:|
  |**All**|20640|
  |**Training**|16505|
  |**Test**|4135|
  |**Feature**|8|

- It is worth noting that the following Spark Python code can also be deployed on Spark for other machine learning problems/datasets given the data file in `libsvm` format. Otherwise, a new data loading function is needed. 

# Summary of results

- In this section, I present an overview of results achieved by different regression models provided by Spark Python framework.
- Same sampling strategy is used for different regression models to split the original dataset into training and test sets. In particular, we sample 80% examples to construct a training set and 20% for test set.
- The performance of different regression models is measure in terms of rooted mean square error RMSE both on training and test sets.
- An overview of the model performance is shown in the following table.

  ||RMSE on training set|RMST on test set|
  |:--|:--|--:|
  |**Least square**|157863.57 | 154816.97|
  |**Lasso**|0|0|
  |**Ridge regression**|0|0|

- The result somehow demonstrates that on [cadata](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cadata) dataset, 

# Linear regression models

Three linear regression models will be covered in this blog post, including linear regression, ridge regression, and lasso. The application context is single label regression problem. Regression problem is sometimes closely related to classification problems, I would recommend my [blog post](http://www.hongyusu.com/programming/2015/10/18/spark-classification-models/) about running classification model on Spark.

## Load and save data files

- `loadLibSVMFile` is the function to load data from file in `libsvm` format, which is a very popular file format for spark feature representation.
- In particular, load data from file in `libsvm` format with the following command. This command will generate a Spark labelPoint data structure.

  {% highlight Python linenos %}
    parsedData = MLUtils.loadLibSVMFile(sc, "../Data/cadata")
  {% endhighlight %}

- `saveAsLibSVMFile` is the function to save data into a file in `libsvm` format which however will not be covered in this post.

## Linear regression model ([code](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/linear_regression.py))

- The idea is to load a single label regression dataset from file in `libsvm` format, separate the original dataset into training and test subsets, perform model training and parameter selection procedure on training set, then test the performance by predicting the value of test examples.
- The complete Python code for running the following experiments with linear regression model can be found from my [GitHub](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/linear_regression.py).
- It is workth noting that the learning rate parameter of stochastic gradient descent optimizaiton sometimes needs to be carefully. Otherwise, the model might not be well constructured and return NaN as prediction.

### Run linear regression model with parameter selections

- The following code performs a parameter selection (grid search) of linear regression model on training data.

  {% highlight Python linenos %}
  # train a lr model
  numIterValList = [1000,3000,5000]
  stepSizeValList = [1e-11,1e-9,1e-7,1e-5]

  # variable for the best parameters
  bestNumIterVal = 200
  bestStepSizeVal = 1
  bestTrainingRMSE = 1e10 

  regParamVal = 0.0
  regTypeVal = None

  for numIterVal,stepSizeVal in itertools.product(numIterValList,stepSizeValList):
    model = LinearRegressionWithSGD.train(trainingData, iterations=numIterVal, step=stepSizeVal, regParam=regParamVal, regType=regTypeVal)
    ValsAndPreds = trainingData.map(lambda p: (p.label, model.predict(p.features)))
    trainingRMSE = math.sqrt(ValsAndPreds.map(lambda (v, p): (v - p)**2).reduce(lambda x, y: x + y) / trainingSize)
    if trainingRMSE:
      if trainingRMSE<bestTrainingRMSE:
        bestNumIterVal = numIterVal
        bestStepSizeVal = stepSizeVal
        bestTrainingRMSE = trainingRMSE
    print numIterVal,stepSizeVal,trainingRMSE
  print bestNumIterVal,bestStepSizeVal,bestTrainingRMSE
  {% endhighlight %}

### Model test

- Test the performance of the model in both training data and test data by the following code.

  {% highlight Python linenos %}
  model = LinearRegressionWithSGD.train(trainingData, iterations=bestNumIterVal, step=bestStepSizeVal, regParam=regParamVal, regType=regTypeVal)

  # Evaluating the model on training data
  ValsAndPreds = trainingData.map(lambda p: (p.label, model.predict(p.features)))
  trainingRMSE = math.sqrt(ValsAndPreds.map(lambda (v, p): (v - p)**2).reduce(lambda x, y: x + y) / trainingSize)
  print trainingRMSE

  # Evaluating the model on training data
  ValsAndPreds = testData.map(lambda p: (p.label, model.predict(p.features)))
  testRMSE = math.sqrt(ValsAndPreds.map(lambda (v, p): (v - p)**2).reduce(lambda x, y: x + y) / testSize)
  print testRMSE
  {% endhighlight %}

### Experimental results

  - The result of parameter selection is shown in the following table.

    |Iteration|Learning rate|RMSE|
    |:--|:--|--:|
    |1000|1e-11|235954.448184|
    |1000|1e-09|178563.914495|
    |1000|1e-07|162352.994777|
    |1000|1e-05|nan|
    |3000|1e-11|235106.111824|
    |3000|1e-09|169423.475736|
    |3000|1e-07|159639.878893|
    |3000|1e-05|nan|
    |5000|1e-11|234527.296389|
    |5000|1e-09|167563.04618|
    |5000|1e-07|157863.568992|
    |5000|1e-05|nan|
  
  - The best parameter setting is shown in the following table.

    |Iteration|Learning rate|RMSE|
    |:--|:--|--:|
    |5000|1e-07|157863.568992|

  - Rooted mean square errors RMSE on both training and test set from linear regression model with the best parameter is shown in the following table.

    ||Training set|Test set|
    |:--|--:|--:|
    |Linear regression|157863.568992 | 154816.967311|



