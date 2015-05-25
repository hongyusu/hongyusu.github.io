---
layout: post
title: "Spark with Python: linear models in MLlib"
description: ""
category: Programming
tags: [Introduction, Programming, Spark, Python, BigData]
---
{% include JB/setup %}


<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>


##Linear models

   - Classification
       - Support vector machines (SVM)
       - Logistic regression

   - Regression
      - Least square regression
      - Lasso regression
      - Ridge regression

   - Regression with streaming data

##Dimensionality reduction

   - Singular value decomposition (SVD): Scala, Java
   - Principle component analysis (PCA): Scala, Java


##Collaborative filtering

- Collaborative filtering (CF) is heavily used in recommender system where the task is to find the missing values in the user-item association matrix.
- The following text combines the introduction of CF available from [MLlib](https://spark.apache.org/docs/latest/mllib-collaborative-filtering.html) and the [Tutorial](https://databricks-training.s3.amazonaws.com/movie-recommendation-with-mllib.html) for recommender system in Spark.
- The data file used here is from MovieLens `./spark-1.3.0-bin-hadoop2.4/data/mllib/als/sample_movielens_ratings.txt` with format `UserID::MovieID::Rating::Time`.
- The basic idea of the script is first to learn a ALS model on the training data with parameter selection on the validation data, and then to make predictions on the test data to measure the performance of the ALS model.
- See [this](http://hongyusu.github.io/files/recommender_CP_ALS.py) for the complete Python script.
- To use Spark Python interface we have to include Spark-Python package
{%highlight python%}
from pyspark import SparkConf, SparkContext
from pyspark.mllib.recommendation import ALS
{%endhighlight%}
- The next step is to configure the current python script with Spark context. In particular, we use local machine for testing the code and use cluster to run the script. 
{%highlight python%}
# set up Spark environment
APP_NAME = "recommender_CP_ALS"
conf = SparkConf().setAppName(APP_NAME)
#conf = conf.setMaster('spark://ukko178:7077')
conf = conf.setMaster('local')
sc = SparkContext(conf=conf)
{%endhighlight%}
- After that, we have to read in the data file as RDD and take a look at the summary of the data
{%highlight python%}
data = sc.textFile('../spark-1.3.0-bin-hadoop2.4/data/mllib/als/sample_movielens_ratings.txt')
ratings = data.map(parseRating)
numRatings  = ratings.count()
numUsers    = ratings.values().map(lambda r:r[0]).distinct().count()
numMovies   = ratings.values().map(lambda r:r[1]).distinct().count()
print "--- %d ratings from %d users for %d movies\n" % (numRatings, numUsers, numMovies)
{%endhighlight%}
The `parseRating` function is defined as
{%highlight python%}
def parseRating(line):
    """
    Parses a rating record in MovieLens format userId::movieId::rating::timestamp.
    """
    fields = line.strip().split("::")
    return long(fields[0]) % 10, (int(fields[0]), int(fields[1]), float(fields[2]))
{%endhighlight%}
- Then we will partition the data into training, validation and test partitions. However,for the purpose of demonstration we use all data for training validation and test. In particular, we get all data from RDD and repartition the data.
{%highlight python%}
numPartitions = 10
training    = ratings.filter(lambda r:r).values().repartition(numPartitions).cache()
validation  = ratings.filter(lambda r:r).values().repartition(numPartitions).cache()
test        = ratings.filter(lambda r:r).values().cache()
numTraining         = training.count()
numValidation       = validation.count()
numTest             = test.count()
print "--- %d training %d validation %d test\n" % (numTraining, numValidation, numTest)
{%endhighlight%}
- After that we will run ALS with parameter selection on the training and validation sets. The performance of the model is measured with _rooted mean square error (RMSE)_.
{%highlight python%}
# training with ALS
ranks       = [8,12]
lambdas     = [0.1,0.01]
numIters    = [10,20]
bestModel   = None
bestValidationRmse = float("inf")
bestRank    = 0
bestLambda  = -1.0
bestNumIter = -1
for rank, lmbda, numIter in itertools.product(ranks, lambdas, numIters):
    model                   = ALS.train(training, rank, numIter, lmbda)
    predictions             = model.predictAll(validation.map(lambda x:(x[0],x[1])))
    predictionsAndRatings   = predictions.map(lambda x:((x[0],x[1]),x[2])).join(validation.map(lambda x:((x[0],x[1]),x[2]))).values()
    validationRmse          = sqrt(predictionsAndRatings.map(lambda x: (x[0] - x[1]) ** 2).reduce(add) / float(numIter))
    print rank, lmbda, numIter, validationRmse
    if (validationRmse < bestValidationRmse):
        bestModel = model
        bestValidationRmse = validationRmse
        bestRank = rank
        bestLambda = lmbda
        bestNumIter = numIter
{%endhighlight%}
- The prediction of the best model on the test data can be computed from
{%highlight python%}
predictions                  = bestModel.predictAll(test.map(lambda x:(x[0],x[1])))
predictionsAndRatings        = predictions.map(lambda x:((x[0],x[1]),x[2])).join( test.map(lambda x:((x[0],x[1]),x[2]))).values()
testRmse                     = sqrt(predictionsAndRatings.map(lambda x: (x[0] - x[1]) ** 2).reduce(add) / float(bestNumIter))
{%endhighlight%}
- We can also compare the performance of ALS with naive approach where we predict all ratings with the average ratings.
{%highlight python%}
# compare the best model with a naive baseline that always returns the mean rating
meanRating = training.union(validation).map(lambda x: x[2]).mean()
baselineRmse = sqrt(test.map(lambda x: (meanRating - x[2]) ** 2).reduce(add) / numTest)
improvement = (baselineRmse - testRmse) / baselineRmse * 100
print "The best model improves the baseline by %.2f percent\n" % (improvement)
{%endhighlight%}
- When everything is done, we will stop Spark context with the following Python command.
{%highlight python%}
# shut down spark
sc.stop()
{%endhighlight%}










