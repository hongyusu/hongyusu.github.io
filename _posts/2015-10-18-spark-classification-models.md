---
layout: post
title: "Spark classification models"
description: ""
category: Programming
tags: [Spark, classification]
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
- Dataset used in the experiment of this post is the well-known [a6a](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary.html#a6a) data from LibSVM website.
- The file is in `libsvm` format which is a sparse feature representation, which can be naturally tackled/loaded by a Spark Python function.
- In order to train a classification model and test it performance, we draw samples uniform at random from the original dataset which forms a training set with 80% examples and a test set with 20% examples.
- The statistics of the dataset is shown in the following table

  |Category|Size|
  |:--|--:|
  |All|11220|
  |Training|8977|
  |Test|2243|
  |Feature|123|

- The following Spark Python code can also be deployed on Spark with other machine learning problems/datasets given the data file in `libsvm` format. Otherwise, a loading function should be implemented. 

# Summary of results

- In this section, I present an overview of results achieved by different classification models provided by Spark Python framework.
- We use a same training and test split for different learning models, which in general is a 80%/20% random split.
- The performance is measured by Hamming loss and is computed both on training set and test set, shown in the following table.

  ||Training set|Test set|
  |:--|--:|--:|
  |SVM|0.1650|0.1575|
  |LR|0.1660|0.1787|

- The result somehow demonstrates that on [a6a](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary.html#a6a) dataset, SVM achieves better performance compared to logistic regression. In particular, the classification accuracy of SVM on test dataset is about 2% higher than logistic regression. 

# Linear classification models

Two classification learning methods will be discussed, support vector machines SVM and logistic regression LR. The application context is single label binary classification. They can also be applied to single label multiclass classification which however will not be covered in this blog post.

## Load and save data files

- `loadLibSVMFile` is the function to load data from file in `libsvm` format, which is a very popular file format for spark feature representation.
- In particular, load data from file in `libsvm` format with the following command. This command will generate a Spark labelPoint data structure.

  {% highlight Python linenos %}
    parsedData = MLUtils.loadLibSVMFile(sc, "../Data/a6a")
  {% endhighlight %}

- It is worth noting that if you load training and test dataset separately it is possible that the dimension of the feature in training and test sets are different due to the spark representation of `libsvm` file format. Therefore, it is better to load the whole dataset and split for training and test later on. If you have to load training and test data separately, you can set the dimension of the feature as one of the input argument of the function.
- `saveAsLibSVMFile` is the function to save data into a file in `libsvm` format.

## Support vector machine SVM ([code](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/linear_classification.py))

- In general, the idea is to load a binary classification dataset in `libsvm` format from a file, separate training and test, perform parameter selection on training data, and make prediction on test data.
- The complete Python code for running the following experiments with SVM can be found from my [GitHub](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/linear_classification.py).

### Run SVM with parameter selections

- The function will take the following parameters
  - data: the training data, an RDD of LabeledPoint.
  - iteration: The number of iterations (default: 100).
  - step: The step parameter used in SGD (default: 1.0).
  - regParam: The regularizer parameter (default: 0.01).
  - miniBatchFraction: Fraction of data to be used for each SGD iteration (default: 1.0).
  - initialWeights: The initial weights (default: None).
  - regType: l2 or l1.
- It is better to check the document of the function because Spark changes rapidly and different versions might not tolerate each other. For example, my Spark is 1.4.1, I check the version of the function in [Spark Document](https://spark.apache.org/docs/1.4.1/api/python/pyspark.mllib.html?highlight=svmwithsgd#pyspark.mllib.classification.SVMWithSGD.train).

- The following code performs a parameter selection (grid search) of SVM on training data.

  {% highlight Python linenos %}
  # train a SVM model
  numIterValList = [100,200]
  regParamValList = [0.01,0.1,1,10,100]
  stepSizeValList = [0.1,0.5,1]
  regTypeValList = ['l2','l1']

  # variable for the best parameters
  bestNumIterVal = 0
  bestRegParamVal = 0
  bestStepSizeVal = 0
  bestRegTypeVal = 0
  bestTrainErr = 100

  for numIterVal,regParamVal,stepSizeVal,regTypeVal in itertools.product(numIterValList,regParamValList,stepSizeValList,regTypeValList):
    model = SVMWithSGD.train(trainingData, iterations=numIterVal, regParam=regParamVal, step=stepSizeVal, regType=regTypeVal)
    labelsAndPreds = trainingData.map(lambda p: (p.label, model.predict(p.features)))
    trainErr = labelsAndPreds.filter(lambda (v, p): v != p).count() / float(trainSize)
    if trainErr<bestTrainErr:
      bestNumIterVal = numIterVal
      bestRegParamVal = regParamVal
      bestStepSizeVal = stepSizeVal
      bestRegTypeVal = regTypeVal
      bestTrainErr = trainErr
  print bestNumIterVal,bestRegParamVal,bestStepSizeVal,bestRegTypeVal,bestTrainErr
  {% endhighlight %}

### Model test

- Test the performance of the model in both training data and test data by the following code block.

  {% highlight Python linenos %}
  # Evaluating the model on training data
  labelsAndPreds = trainingData.map(lambda p: (p.label, model.predict(p.features)))
  trainErr = labelsAndPreds.filter(lambda (v, p): v != p).count() / float(trainSize)
  print trainErr

  # Evaluating the model on training data
  labelsAndPreds = testData.map(lambda p: (p.label, model.predict(p.features)))
  testErr = labelsAndPreds.filter(lambda (v, p): v != p).count() / float(testSize)
  print testErr
  {% endhighlight %}

### Experimental results

  - The result of parameter selection is shown in the following table

    |Iteration|C|Learning rate|Norm|Hamming loss|
    |:--|:--|:--|--:|
    |100|0.01|0.1|l2|0.237813720022|
    |100|0.01|0.1|l1|0.237813720022|
    |100|0.01|0.5|l2|0.186279977691|
    |100|0.01|0.5|l1|0.225432236475|
    |100|0.01|1|l2|0.16419408812|
    |100|0.01|1|l1|0.180479643056|
    |100|0.1|0.1|l2|0.237813720022|
    |100|0.1|0.1|l1|0.237813720022|
    |100|0.1|0.5|l2|0.224316787507|
    |100|0.1|0.5|l1|0.237813720022|
    |100|0.1|1|l2|0.206804238706|
    |100|0.1|1|l1|0.237813720022|
    |100|1|0.1|l2|0.237813720022|
    |100|1|0.1|l1|0.237813720022|
    |100|1|0.5|l2|0.237813720022|
    |100|1|0.5|l1|0.237813720022|
    |100|1|1|l2|0.237813720022|
    |100|1|1|l1|0.237813720022|
    |100|10|0.1|l2|0.237813720022|
    |100|10|0.1|l1|0.237813720022|
    |100|10|0.5|l2|0.237813720022|
    |100|10|0.5|l1|0.237813720022|
    |100|10|1|l2|0.237813720022|
    |100|10|1|l1|0.237813720022|
    |100|100|0.1|l2|0.237813720022|
    |100|100|0.1|l1|0.237813720022|
    |100|100|0.5|l2|0.762186279978|
    |100|100|0.5|l1|0.237813720022|
    |100|100|1|l2|0.762186279978|
    |100|100|1|l1|0.237813720022|
    |200|0.01|0.1|l2|0.237813720022|
    |200|0.01|0.1|l1|0.237813720022|
    |200|0.01|0.5|l2|0.167540435025|
    |200|0.01|0.5|l1|0.21226993865|
    |200|0.01|1|l2|0.162744004462|
    |200|0.01|1|l1|0.169659788065|
    |200|0.1|0.1|l2|0.237813720022|
    |200|0.1|0.1|l1|0.237813720022|
    |200|0.1|0.5|l2|0.215839375349|
    |200|0.1|0.5|l1|0.237813720022|
    |200|0.1|1|l2|0.204350250976|
    |200|0.1|1|l1|0.237813720022|
    |200|1|0.1|l2|0.237813720022|
    |200|1|0.1|l1|0.237813720022|
    |200|1|0.5|l2|0.237813720022|
    |200|1|0.5|l1|0.237813720022|
    |200|1|1|l2|0.237813720022|
    |200|1|1|l1|0.237813720022|
    |200|10|0.1|l2|0.237813720022|
    |200|10|0.1|l1|0.237813720022|
    |200|10|0.5|l2|0.237813720022|
    |200|10|0.5|l1|0.237813720022|
    |200|10|1|l2|0.237813720022|
    |200|10|1|l1|0.237813720022|
    |200|100|0.1|l2|0.237813720022|
    |200|100|0.1|l1|0.237813720022|
    |200|100|0.5|l2|0.762186279978|
    |200|100|0.5|l1|0.237813720022|
    |200|100|1|l2|0.762186279978|
    |200|100|1|l1|0.237813720022|
  
  - The best parameter is shown in the following table

    |Iteration|C|Learning rate|Norm|Hamming loss|
    |:--|:--|:--|--:|
    |200|0.01|1|l2|0.162744004462|

  - Training and text error of SVM with the best parameter is shown in the following table

    ||Training set|Test set|
    |:--|--:|--:|
    |SVM|0.1650|0.1575|

## Logistic regression LR ([code](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/linear_classification.py))

- In general, the idea is to load a binary classification dataset in `libsvm` format from a file, separate training and test, perform parameter selection on training data, and make prediction on test data.
- The complete Python code for running the following experiments with logistic regression can be found from my [GitHub](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/linear_classification.py).


### Run LR for parameter selection

- Python code for running parameter selection procedure of logistic regression is shown in the following code block

  {% highlight Python linenos %}
  def lr(trainingData,testData,trainingSize,testSize):
  '''
  linear lr classifier
  '''
  # train a lr model
  numIterValList = [100,200]
  regParamValList = [0.01,0.1,1,10,100]
  stepSizeValList = [0.1,0.5,1]
  regTypeValList = ['l2','l1']

  # variable for the best parameters
  bestNumIterVal = 200
  bestRegParamVal = 0.01
  bestStepSizeVal = 1
  bestRegTypeVal = 'l2'
  bestTrainErr = 100

  for numIterVal,regParamVal,stepSizeVal,regTypeVal in itertools.product(numIterValList,regParamValList,stepSizeValList,regTypeValList):
    model = LogisticRegressionWithSGD.train(trainingData, iterations=numIterVal, regParam=regParamVal, step=stepSizeVal, regType=regTypeVal)
    labelsAndPreds = trainingData.map(lambda p: (p.label, model.predict(p.features)))
    trainErr = labelsAndPreds.filter(lambda (v, p): v != p).count() / float(trainingSize)
    if trainErr<bestTrainErr:
      bestNumIterVal = numIterVal
      bestRegParamVal = regParamVal
      bestStepSizeVal = stepSizeVal
      bestRegTypeVal = regTypeVal
      bestTrainErr = trainErr
    print numIterVal,regParamVal,stepSizeVal,regTypeVal,trainErr
  print bestNumIterVal,bestRegParamVal,bestStepSizeVal,bestRegTypeVal,bestTrainErr
  {% endhighlight%} 

- The performance of the best model can be computed on training and test datasets with the following code

  {% highlight Python linenos %}
  model = LogisticRegressionWithSGD.train(trainingData, iterations=bestNumIterVal, regParam=bestRegParamVal, step=bestStepSizeVal, regType=bestRegTypeVal)

  # Evaluating the model on training data
  labelsAndPreds = trainingData.map(lambda p: (p.label, model.predict(p.features)))
  trainErr = labelsAndPreds.filter(lambda (v, p): v != p).count() / float(trainingSize)
  print trainErr

  # Evaluating the model on training data
  labelsAndPreds = testData.map(lambda p: (p.label, model.predict(p.features)))
  testErr = labelsAndPreds.filter(lambda (v, p): v != p).count() / float(testSize)
  print testErr
  {% endhighlight %}

### Experimental results

  - The result of parameter selection for logistic regression is shown in the following table

    |Iteration|C|Learning rate|Norm|Hamming loss|
    |:--|:--|:--|--:|
    |100|0.01|0.1|l2|0.240232844509|
    |100|0.01|0.1|l1|0.240344788985|
    |100|0.01|0.5|l2|0.18246949513|
    |100|0.01|0.5|l1|0.205306168141|
    |100|0.01|1|l2|0.17194671443|
    |100|0.01|1|l1|0.179782827717|
    |100|0.1|0.1|l2|0.240232844509|
    |100|0.1|0.1|l1|0.240344788985|
    |100|0.1|0.5|l2|0.205306168141|
    |100|0.1|0.5|l1|0.240344788985|
    |100|0.1|1|l2|0.191536997649|
    |100|0.1|1|l1|0.240344788985|
    |100|1|0.1|l2|0.240344788985|
    |100|1|0.1|l1|0.240344788985|
    |100|1|0.5|l2|0.240344788985|
    |100|1|0.5|l1|0.240344788985|
    |100|1|1|l2|0.240344788985|
    |100|1|1|l1|0.240344788985|
    |100|10|0.1|l2|0.240344788985|
    |100|10|0.1|l1|0.240344788985|
    |100|10|0.5|l2|0.240344788985|
    |100|10|0.5|l1|0.240344788985|
    |100|10|1|l2|0.240344788985|
    |100|10|1|l1|0.240344788985|
    |100|100|0.1|l2|0.240344788985|
    |100|100|0.1|l1|0.240344788985|
    |100|100|0.5|l2|0.759655211015|
    |100|100|0.5|l1|0.240344788985|
    |100|100|1|l2|0.759655211015|
    |100|100|1|l1|0.240344788985|
    |200|0.01|0.1|l2|0.239785066607|
    |200|0.01|0.1|l1|0.240232844509|
    |200|0.01|0.5|l2|0.174857270794|
    |200|0.01|0.5|l1|0.188850330236|
    |200|0.01|1|l2|0.16791671331|
    |200|0.01|1|l1|0.173625881563|
    |200|0.1|0.1|l2|0.239785066607|
    |200|0.1|0.1|l1|0.240344788985|
    |200|0.1|0.5|l2|0.195678943244|
    |200|0.1|0.5|l1|0.240344788985|
    |200|0.1|1|l2|0.190417552894|
    |200|0.1|1|l1|0.240344788985|
    |200|1|0.1|l2|0.240344788985|
    |200|1|0.1|l1|0.240344788985|
    |200|1|0.5|l2|0.240344788985|
    |200|1|0.5|l1|0.240344788985|
    |200|1|1|l2|0.240344788985|
    |200|1|1|l1|0.240344788985|
    |200|10|0.1|l2|0.240344788985|
    |200|10|0.1|l1|0.240344788985|
    |200|10|0.5|l2|0.240344788985|
    |200|10|0.5|l1|0.240344788985|
    |200|10|1|l2|0.240344788985|
    |200|10|1|l1|0.240344788985|
    |200|100|0.1|l2|0.240344788985|
    |200|100|0.1|l1|0.240344788985|
    |200|100|0.5|l2|0.759655211015|
    |200|100|0.5|l1|0.240344788985|
    |200|100|1|l2|0.759655211015|
    |200|100|1|l1|0.240344788985|

  - The best parameter is shown in the following table

    |Iteration|C|Learning rate|Norm|Hamming loss|
    |:--|:--|:--|--:|
    |200|0.01|1|l2|0.16791671331|

  - Training and text error of SVM with the best parameter is shown in the following table

    ||Training set|Test set|
    |:--|--:|--:|
    |LR|0.1660|0.1787|


