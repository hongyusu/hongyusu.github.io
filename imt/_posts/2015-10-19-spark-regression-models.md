---
layout: imt-post
title: "Spark regression models"
description: ""
category: Technology
tags: [Spark, Regression]
---
 Spark regression models

# Table of content
* auto-gen TOC:
{:toc}


# System and experiment settings

- Spark is running on a cluster of 1 master node 14 slave nodes. Each node is a work station with 16 x E5540@2.53GHz CPU and 32G memory.
- In this blog post, several linear regression models will be presented, including
  - least square regression
  - lasso regression
  - logistic regression
  - decision tree regression
  - random forest regression
- If you are also interested in classification models provided in Spark, I have another post about [Spark classification models](http://www.hongyusu.com/programming/2015/10/18/spark-classification-models/).
- Dataset used in the following regression experiment include
  - median size [cadata](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cadata) data available from LibSVM website.
  - larger size [YearPredictionMSD](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/YearPredictionMSD.bz2) data available also from LibSVM website. 
- In particular, the data file is in `libsvm` format. It is a sparse feature representation which can be naturally handled/loaded by a Spark Python function.
- In order to train a regression model and test it performance, we split the original dataset into training set and test set. More specifically, we sample 80% of examples uniformly at random to form a training set for learning a regression model, and sample 20% of the examples to form a test set which is used to test the performance of the constructed model.
- The statistics of the cadata is shown in the following table.

  |Category|Size|
  |:--|--:|
  |**All**     |20640|
  |**Training**|16505|
  |**Test**    |4135 |
  |**Feature** |8    |

- The statistics of the YearPredictionMSD dataset is shown in the following table.

  |Category|Size|
  |:--|--:|
  |**All**     |463715|
  |**Training**|371065|
  |**Test**    |92650 |
  |**Feature** |90    |

- It is worth noting that the following Spark Python code can also be deployed on Spark for other machine learning problems/datasets given the data file in `libsvm` format. Otherwise, you need a new data loading function. 

# Summary of results

- In this section, I present an overview of results achieved by different regression models provided in Spark Python framework.
- Same sampling strategy is used in different regression models to split the original dataset into training and test sets. In particular, we sample 80% examples to for a training set and 20% for test set.
- The performance of different regression models is measured in terms of rooted mean square error RMSE on both training and test sets.

$$RMSE = \sqrt{\frac{1}{N}\sum_{i=1}^{N}(y_i-w^Tx_i)^2}$$

## **On cadata dataset** [link](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cadata)

- The performance in RMSE is shown in the following table.

  ||RMSE on training set|RMST on test set|
  |:--|--:|--:|
  |**Least square**|157863.57 | 154816.97|
  |**Lasso**|157841.41|155106.52|
  |**Ridge regression**|157846.79|155111.65|
  |**Decision tree regression**|810.30 | 71149.69|
  |**Random forest regression**|19943.03 | 49763.60|
 
- The result somehow demonstrates that on [cadata](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cadata) dataset decision tree and random forest regressors achieve better RMSE compared to least square regression, lasso, and ridge regression.
- Decision tree regressor seems to overfit the training data while random forest regressor achieves the best performance on test set.

## **On YearPredictionMSD dataset** [link](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/YearPredictionMSD.bz2)

- The performance in RMSE is shown in the following table.

  ||RMSE on training set|RMST on test set|
  |:--|--:|--:|
  |**Least square**            |     |  |
  |**Lasso**                   |     |  |
  |**Ridge regression**        |     |  |
  |**Decision tree regression**|0.70          |13.38  |
  |**Random forest regression**|3.74          | 9.32 |
 
- The result somehow demonstrates that on [YearPredictionMSD](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/YearPredictionMSD.bz2) dataset decision tree and random forest regressors achieve better RMSE compared to least square regression, lasso, and ridge regression.
- Decision tree regressor seems to overfit the training data while random forest regressor achieves the best performance on test set.


   
# Linear regression models

Three linear regression models will be covered in this blog post, including least square, ridge regression, and lasso. The application context is single label regression problem. Regression problem is sometimes closely related to classification problems, I would recommend my [blog post](http://www.hongyusu.com/programming/2015/10/18/spark-classification-models/) about running classification model on Spark.

## Load and save data files

- `loadLibSVMFile` is the function to load data from file in `libsvm` format, which is a very popular file format for spark feature representation.
- In particular, load data from file in `libsvm` format with the following command. This command will generate a Spark labelPoint data structure.

  ```python
    parsedData = MLUtils.loadLibSVMFile(sc, "../Data/cadata")
  ```

- `saveAsLibSVMFile` is the function to save data into a file in `libsvm` format which however will not be covered in this post.

## Least square ([code](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/linear_regression.py))

- Least square is a linear model which fit a linear function to training data while minimizing the so called mean square error MSE. 
- The optimization problem of least square is shown as the follow

  $$\underset{w}{\min}\, \frac{1}{n}\sum_{i}(y_i-w^Tx_i)^2$$

- The idea of the following Python script is to load a single label regression dataset from file in `libsvm` format, separate the original dataset into training and test subsets, perform model training and parameter selection procedure on training set, then test the performance by predicting the value of test examples.
- The complete Python code for running the following experiments with least square can be found from my [GitHub](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/linear_regression.py).
- It is workth noting that the learning rate parameter of stochastic gradient descent optimizaiton sometimes needs to be carefully. Otherwise, the model might not be well constructured and return NaN as prediction.

### Run least square with parameter selections

- The following code performs a parameter selection (grid search) of least square on training data.

  ```python
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
  ```

### Model test

- Test the performance of the model in both training data and test data by the following code.

  ```python
  model = LinearRegressionWithSGD.train(trainingData, iterations=bestNumIterVal, step=bestStepSizeVal, regParam=regParamVal, regType=regTypeVal)

  # Evaluating the model on training data
  ValsAndPreds = trainingData.map(lambda p: (p.label, model.predict(p.features)))
  trainingRMSE = math.sqrt(ValsAndPreds.map(lambda (v, p): (v - p)**2).reduce(lambda x, y: x + y) / trainingSize)
  print trainingRMSE

  # Evaluating the model on training data
  ValsAndPreds = testData.map(lambda p: (p.label, model.predict(p.features)))
  testRMSE = math.sqrt(ValsAndPreds.map(lambda (v, p): (v - p)**2).reduce(lambda x, y: x + y) / testSize)
  print testRMSE
  ```

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

  - Rooted mean square errors RMSE on both training and test set from least square with the best parameter is shown in the following table.

    ||Training set|Test set|
    |:--|--:|--:|
    |**Least square**|157863.568992 | 154816.967311|


## Lasso and ridge regression ([code](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/linear_regression.py))

- Lasso is similar as least square regression but with L1 norm regularization.
- In particular, the optimization problem of Lasso is shown as the follows

  $$\underset{w}{\min}\, \frac{1}{n}\sum_{i}(y_i-w^Tx_i)^2  + \frac{\lambda}{2}||w||_1^2,$$

  where
$$||w||_1$$
is the L1 norm regularization of the feature weight parameter $$w$$. L1 norm regularization will enforce a sparse solution of the feature weight parameter $$w$$.

- Ridge regression is also similar as least square regression but with L2 norm regularization.
- In particular, the optimization problem of ridge regression is shown as the follows

  $$\underset{w}{\min}\, \frac{1}{n}\sum_{i}(y_i-w^Tx_i)^2  + \frac{\lambda}{2}||w||_2^2,$$

  where 
$$||w||_2$$
is the L2 norm regularization of the feature weight parameter $$w$$. L2 norm regularization will lead to a smooth solution of the feature weight parameter $$w$$.
- The following sections describe a Python code for Lasso and ridge regression implemented with function `LinearRegressionWithSGD` switching `regType` parameter. Meanwhile, there is another function `LassoWithSGD` available in Spark.

### Run Lasso/Ridge with parameter selections

- The following code performs a parameter selection (grid search) of Lasso on training data.

  ```python
  # train a lr model
  numIterValList = [1000,3000,5000]
  stepSizeValList = [1e-11,1e-9,1e-7,1e-5]
  regParamValList = [0.01,0.1,1,10,100]

  # variable for the best parameters
  bestNumIterVal = 200
  bestStepSizeVal = 1
  bestTrainingRMSE = 1e10 
  bestRegParamVal = 0.0

  regTypeVal = 'l1'

  for numIterVal,stepSizeVal,regParamVal in itertools.product(numIterValList,stepSizeValList,regParamValList):
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
  ```

### Model test

- I use the following code to test the performance of the constructed model on both training and test set. The performance is measured by rooted mean square error RMSE.

  ```python
  model = LinearRegressionWithSGD.train(trainingData, iterations=bestNumIterVal, step=bestStepSizeVal, regParam=regParamVal, regType=regTypeVal)
  # Evaluating the model on training data
  ValsAndPreds = trainingData.map(lambda p: (p.label, model.predict(p.features)))
  trainingRMSE = math.sqrt(ValsAndPreds.map(lambda (v, p): (v - p)**2).reduce(lambda x, y: x + y) / trainingSize)
  print trainingRMSE
  # Evaluating the model on training data
  ValsAndPreds = testData.map(lambda p: (p.label, model.predict(p.features)))
  testRMSE = math.sqrt(ValsAndPreds.map(lambda (v, p): (v - p)**2).reduce(lambda x, y: x + y) / testSize)
  print testRMSE
  ```

### Experimental results for Lasso

- Experimental results of parameter selection for Lasso is shown in the following table.

  |Iteration|Learning rate|Regularization|RMSE|
  |:--|:--|:---|--:|
  |1000|1e-11|0.01|236203.490014|
  |1000|1e-11|0.1|236203.490014|
  |1000|1e-11|1|236203.490017|
  |1000|1e-11|10|236203.490043|
  |1000|1e-11|100|236203.490306|
  |1000|1e-09|0.01|178516.068253|
  |1000|1e-09|0.1|178516.068262|
  |1000|1e-09|1|178516.068352|
  |1000|1e-09|10|178516.069244|
  |1000|1e-09|100|178516.07817|
  |1000|1e-07|0.01|162300.327801|
  |1000|1e-07|0.1|162300.327855|
  |1000|1e-07|1|162300.328397|
  |1000|1e-07|10|162300.333816|
  |1000|1e-07|100|162300.388008|
  |1000|1e-05|0.01|nan|
  |1000|1e-05|0.1|nan|
  |1000|1e-05|1|nan|
  |1000|1e-05|10|nan|
  |1000|1e-05|100|nan|
  |3000|1e-11|0.01|235349.196217|
  |3000|1e-11|0.1|235349.196218|
  |3000|1e-11|1|235349.196222|
  |3000|1e-11|10|235349.196268|
  |3000|1e-11|100|235349.196724|
  |3000|1e-09|0.01|169380.476224|
  |3000|1e-09|0.1|169380.476231|
  |3000|1e-09|1|169380.476296|
  |3000|1e-09|10|169380.476946|
  |3000|1e-09|100|169380.483446|
  |3000|1e-07|0.01|159605.030202|
  |3000|1e-07|0.1|159605.030294|
  |3000|1e-07|1|159605.031219|
  |3000|1e-07|10|159605.040461|
  |3000|1e-07|100|159605.132881|
  |3000|1e-05|0.01|nan|
  |3000|1e-05|0.1|nan|
  |3000|1e-05|1|nan|
  |3000|1e-05|10|nan|
  |3000|1e-05|100|nan|
  |5000|1e-11|0.01|234766.331363|
  |5000|1e-11|0.1|234766.331364|
  |5000|1e-11|1|234766.331369|
  |5000|1e-11|10|234766.331428|
  |5000|1e-11|100|234766.332016|
  |5000|1e-09|0.01|167529.15979|
  |5000|1e-09|0.1|167529.159795|
  |5000|1e-09|1|167529.159844|
  |5000|1e-09|10|167529.160328|
  |5000|1e-09|100|167529.165176|
  |5000|1e-07|0.01|157841.276486|
  |5000|1e-07|0.1|157841.276602|
  |5000|1e-07|1|157841.277759|
  |5000|1e-07|10|157841.289332|
  |5000|1e-07|100|157841.405059|
  |5000|1e-05|0.01|nan|
  |5000|1e-05|0.1|nan|
  |5000|1e-05|1|nan|
  |5000|1e-05|10|nan|
  |5000|1e-05|100|nan|

  `nan` is in the situation that we have a poor model due to the step size of SGD.

- It seems that learning rate parameter plays an important role in the performance of the model. When fix the learning rate, regularization parameter $$\lambda$$ slighly effects the performance of the model.

- The best parameter setting is shown in the following table.

  |Iteration|Learning rate|Regularization|RMSE|
  |:--|:--|:---|--:|
  |5000|1e-07|0.01|157841.276486|

- Rooted mean square errors RMSE on both training and test sets from Lasso with the best parameters is shown in the following table.

  ||Training set|Test set|
  |:--|--:|--:|
  |**Lasso**|157841.405059|155106.51828|

### Experimental results for ridge regression

- Experimental results of parameter selection for ridge regression is shown in the following table.

  |Iteration|Learning rate|Regularization|RMSE|
  |:--|:--|:---|--:|
  |1000|1e-11|0.01|236203.490014|
  |1000|1e-11|0.1|236203.490014|
  |1000|1e-11|1|236203.490014|
  |1000|1e-11|10|236203.490017|
  |1000|1e-11|100|236203.490049|
  |1000|1e-09|0.01|178516.068262|
  |1000|1e-09|0.1|178516.068351|
  |1000|1e-09|1|178516.069235|
  |1000|1e-09|10|178516.078079|
  |1000|1e-09|100|178516.166519|
  |1000|1e-07|0.01|162300.327913|
  |1000|1e-07|0.1|162300.328979|
  |1000|1e-07|1|162300.339636|
  |1000|1e-07|10|162300.44621|
  |1000|1e-07|100|162301.51175|
  |1000|1e-05|0.01|nan|
  |1000|1e-05|0.1|nan|
  |1000|1e-05|1|nan|
  |1000|1e-05|10|nan|
  |1000|1e-05|100|nan|
  |3000|1e-11|0.01|235349.196217|
  |3000|1e-11|0.1|235349.196217|
  |3000|1e-11|1|235349.196218|
  |3000|1e-11|10|235349.196228|
  |3000|1e-11|100|235349.196325|
  |3000|1e-09|0.01|169380.476234|
  |3000|1e-09|0.1|169380.476324|
  |3000|1e-09|1|169380.477232|
  |3000|1e-09|10|169380.486313|
  |3000|1e-09|100|169380.577123|
  |3000|1e-07|0.01|159605.030531|
  |3000|1e-07|0.1|159605.033588|
  |3000|1e-07|1|159605.064158|
  |3000|1e-07|10|159605.369845|
  |3000|1e-07|100|159608.425707|
  |3000|1e-05|0.01|nan|
  |3000|1e-05|0.1|nan|
  |3000|1e-05|1|nan|
  |3000|1e-05|10|nan|
  |3000|1e-05|100|nan|
  |5000|1e-11|0.01|234766.331363|
  |5000|1e-11|0.1|234766.331363|
  |5000|1e-11|1|234766.331365|
  |5000|1e-11|10|234766.331381|
  |5000|1e-11|100|234766.331543|
  |5000|1e-09|0.01|167529.159798|
  |5000|1e-09|0.1|167529.159869|
  |5000|1e-09|1|167529.160586|
  |5000|1e-09|10|167529.167747|
  |5000|1e-09|100|167529.239367|
  |5000|1e-07|0.01|157841.277025|
  |5000|1e-07|0.1|157841.281988|
  |5000|1e-07|1|157841.331623|
  |5000|1e-07|10|157841.827952|
  |5000|1e-07|100|157846.789126|
  |5000|1e-05|0.01|nan|
  |5000|1e-05|0.1|nan|
  |5000|1e-05|1|nan|
  |5000|1e-05|10|nan|
  |5000|1e-05|100|nan|

- The best parameter setting is shown in the following table.

  |Iteration|Learning rate|Regularization|RMSE|
  |:--|:--|:---|--:|
  |5000|1e-07|0.01|157841.277025|

- Rooted mean square errors RMSE on both training and test sets from ridge regression with the best parameter is shown in the following table.

  ||Training set|Test set|
  |:--|--:|--:|
  |**Ridge regression**|157846.789126|155111.648864|

# Decision tree regressor ([code](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/linear_regression.py))

## Experimental results

### YearPredictionMSD dataset [download](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/YearPredictionMSD.bz2)

- results of parameter selection for decision tree regressor is shown in the following table.

  |maxdepth|maxbins|rmse|
  |:--|:--|--:|
  |10|16|9.43431370515|
  |10|24|9.41958875566|
  |10|32|9.41548620703|
  |20|16|4.35768086186|
  |20|24|4.4491520211|
  |20|32|4.36669679487|
  |30|16|0.698248656885|
  |30|24|0.79267138039|
  |30|32|0.867840147731|
  |30|16|0.698248656885|

- Performance of decision tree regressor with best parameter on training and test sets

  |maxDepth|maxBins|Training RMSE|test RMSE|
  |:--|:--|:--|--:|
  |30|16|0.698248656885|13.3839477649|

### cadata dataset [download](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cadata)

- results of parameter selection for decision tree regressor is shown in the following table.

  |maxdepth|maxbins|rmse|
  |:--|:--|--:|
  |10|16|55111.5032939|
  |10|24|51187.6835561|
  |10|32|49280.3022651|
  |20|16|10338.3244273|
  |20|24|8516.19589408|
  |20|32|7565.77286084|
  |30|16|6756.45379602|
  |30|24|3077.23346467|
  |30|32|810.303938008|
  |30|32|810.303938008|

- Performance of decision tree regressor with best parameter on training and test sets

  |maxDepth|maxBins|Training RMSE|test RMSE|
  |:--|:--|:--|--:|
  |30|32|810.303938008|71149.6926611|

## Coding details

- The Python function for training a decision tree regressor is shown in the following code block. The complete Python script can be found from [my GitHub page](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/linear_regression.py).

  ```python
  def decisionTreeRegression(trainingData,testData,trainingSize,testSize):
  '''
  decision tree for regression
  '''
  # parameter range
  maxDepthValList = [5,10,15]
  maxBinsVal = [16,24,32]

  # best parameters
  bestMaxDepthVal = 5
  bestMaxBinsVal = 16
  bestTrainingRMSE = 1e10

  for maxDepthVal,maxBinsVal in itertools.product(maxDepthValList,maxBinsVal):
    model = DecisionTree.trainRegressor(trainingData,categoricalFeaturesInfo={},impurity='variance',maxDepth=maxDepthVal,maxBins=maxBinsVal)
    predictions = model.predict(trainingData.map(lambda x:x.features))
    ValsAndPreds = trainingData.map(lambda x:x.label).zip(predictions)
    trainingRMSE = math.sqrt(ValsAndPreds.map(lambda (v, p): (v - p)**2).reduce(lambda x, y: x + y) / trainingSize)
    if trainingRMSE:
      if trainingRMSE<bestTrainingRMSE:
        bestMaxDepthVal = maxDepthVal
        bestMaxBinsVal = maxBinsVal
        bestTrainingRMSE = trainingRMSE
    print maxDepthVal, maxBinsVal, trainingRMSE
  print bestMaxDepthVal,bestMaxBinsVal,bestTrainingRMSE

  model = DecisionTree.trainRegressor(trainingData,categoricalFeaturesInfo={},impurity='variance',maxDepth=bestMaxDepthVal,maxBins=bestMaxBinsVal)

  # evaluating the model on training data
  predictions = model.predict(trainingData.map(lambda x:x.features))
  ValsAndPreds = trainingData.map(lambda x:x.label).zip(predictions)
  trainingRMSE = math.sqrt(ValsAndPreds.map(lambda (v, p): (v - p)**2).reduce(lambda x, y: x + y) / trainingSize)
  print trainingRMSE

  # evaluating the model on test data
  predictions = model.predict(testData.map(lambda x:x.features))
  ValsAndPreds = testData.map(lambda x:x.label).zip(predictions)
  testRMSE = math.sqrt(ValsAndPreds.map(lambda (v, p): (v - p)**2).reduce(lambda x, y: x + y) / testSize)
  print testRMSE
  ```

# Random forest regressor ([code](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/linear_regression.py))

## Experimental results

### YearPredictionMSD dataset [download](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/YearPredictionMSD.bz6)

- results of parameter selection for decision tree regressor is shown in the following table.

  |maxdepth|maxbins|numTrees|RMSE|
  |:--|:--|:--|--:|
  |10|16|10|9.25951426448|
  |10|16|20|9.22474837657|
  |10|16|30|9.23054126678|
  |10|24|10|9.23919432668|
  |10|24|20|9.20489367291|
  |10|24|30|9.19897910587|
  |10|32|10|9.25450519266|
  |10|32|20|9.20567410721|
  |10|32|30|9.18749240617|
  |20|16|10|5.1040872132|
  |20|16|20|4.82955431151|
  |20|16|30|4.7025300781|
  |20|24|10|5.11964372367|
  |20|24|20|4.84030537361|
  |20|24|30|4.78313760797|
  |20|32|10|5.22852708594|
  |20|32|20|4.91953677671|
  |20|32|30|4.86195922299|
  |30|16|10|4.12055264414|
  |30|16|20|3.74304424697|
  |30|24|10|4.1223783085|
  |30|24|20|3.75372882494|
  |30|32|10|4.10218005322|
  |30|32|20|3.75214909232|

- Performance of decision tree regressor with best parameter on training and test sets

  |maxDepth|maxBins|numTrees|Training RMSE|test RMSE|
  |:--|:--|:--|:--|--:|
  |30|16|20|3.74304424697|9.32017817336|

### cadata dataset [download](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cadata)

- results of parameter selection for decision tree regressor is shown in the following table.

  |maxdepth|maxbins|numTrees|RMSE|
  |:--|:--|:--|--:|
  |10|16|10|55038.0827027|
  |10|16|30|53430.1370036|
  |10|16|50|52858.4370596|
  |10|24|10|50673.4009976|
  |10|24|30|49798.1615418|
  |10|24|50|50149.3180680|
  |10|32|10|49471.2622304|
  |10|32|30|49746.8571448|
  |10|32|50|48637.6722695|
  |20|16|10|27888.0801328|
  |20|16|30|24986.1227465|
  |20|16|50|24715.9205242|
  |20|24|10|25038.4034279|
  |20|24|30|22242.7560252|
  |20|24|50|21939.0580146|
  |20|32|10|23934.9090671|
  |20|32|30|21621.0973069|
  |20|32|50|21045.6223585|
  |30|16|10|27439.8585243|
  |30|16|30|24156.0625537|
  |30|16|50|24046.7530621|
  |30|24|10|24697.7285380|
  |30|24|30|21434.6262417|
  |30|24|50|20866.6998838|
  |30|32|10|23527.2245341|
  |30|32|30|20808.0404106|

- Performance of decision tree regressor with best parameter on training and test sets

  |maxDepth|maxBins|numTrees|Training RMSE|test RMSE|
  |:--|:--|:--|:--|--:|
  |30|32|50|19943.0300873|49763.5977607|

## Coding details

- The Python function for training a random forest regressor is shown in the following code block. The complete Python script can be found from [my GitHub page](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/linear_regression.py).

  ```python
  def randomForestRegression(trainingData,testData,trainingSize,testSize):
  '''
  random forest for regression
  '''
  # parameter range
  maxDepthValList = [10,20,30]
  maxBinsValList = [16,24,32]
  numTreesValList = [10,30,50]

  # best parameters
  bestMaxDepthVal = 10
  bestMaxBinsVal = 16
  bestNumTreesVal = 10
  bestTrainingRMSE = 1e10

  for maxDepthVal,maxBinsVal,numTreesVal in itertools.product(maxDepthValList,maxBinsValList,numTreesValList):
    model = RandomForest.trainRegressor(trainingData,categoricalFeaturesInfo={},numTrees=numTreesVal,featureSubsetStrategy="auto",impurity='variance',maxDepth=maxDepthVal,maxBins=maxBinsVal)
    predictions = model.predict(trainingData.map(lambda x:x.features))
    ValsAndPreds = trainingData.map(lambda x:x.label).zip(predictions)
    trainingRMSE = math.sqrt(ValsAndPreds.map(lambda (v, p): (v - p)**2).reduce(lambda x, y: x + y) / trainingSize)
    if trainingRMSE:
      if trainingRMSE<bestTrainingRMSE:
        bestMaxDepthVal = maxDepthVal
        bestMaxBinsVal = maxBinsVal
        bestNumTreesVal = numTreesVal
        bestTrainingRMSE = trainingRMSE
    print maxDepthVal, maxBinsVal, numTreesVal, trainingRMSE
  print bestMaxDepthVal,bestMaxBinsVal, bestNumTreesVal, bestTrainingRMSE

  model = RandomForest.trainRegressor(trainingData,categoricalFeaturesInfo={},numTrees=bestNumTreesVal,featureSubsetStrategy="auto",impurity='variance',maxDepth=bestMaxDepthVal,maxBins=bestMaxBinsVal)

  # evaluating the model on training data
  predictions = model.predict(trainingData.map(lambda x:x.features))
  ValsAndPreds = trainingData.map(lambda x:x.label).zip(predictions)
  trainingRMSE = math.sqrt(ValsAndPreds.map(lambda (v, p): (v - p)**2).reduce(lambda x, y: x + y) / trainingSize)
  print trainingRMSE

  # evaluating the model on test data
  predictions = model.predict(testData.map(lambda x:x.features))
  ValsAndPreds = testData.map(lambda x:x.label).zip(predictions)
  testRMSE = math.sqrt(ValsAndPreds.map(lambda (v, p): (v - p)**2).reduce(lambda x, y: x + y) / testSize)
  print testRMSE
  ```

# External reading materials

- Documentation about Spark MLlib can be found from [Spark official page](http://spark.apache.org/docs/latest/mllib-linear-methods.html).
- Alex Smola has a very concise blog post about parallel optimization using stochastic gradient descent with title '[Parallel stochastic gradient descent](http://blog.smola.org/post/977927287/parallel-stochastic-gradient-descent)' :thumbsup:
- NIPS paper '[Slow learners are fast](http://papers.nips.cc/paper/3888-slow-learners-are-fast.pdf)' from John Langford and coauthors is about SGD for multicore in online learning context.
- NIPS paper '[Parallelized stochastic gradient descent](http://martin.zinkevich.org/publications/nips2010.pdf)' from martin Zinkevich is about minibatch multicore SGD. Basically, it is the one used in Spark. 



