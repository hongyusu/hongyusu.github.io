---
layout: post
title: "Spark with Python: collaborative filtering"
description: ""
category: Programming
tags: [Introduction, Programming, Algorithm, Spark, Python, BigData]
---
{% include JB/setup %}


<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>

##Collaborative filtering

###Algorithm
The algorithm implemented for collaborative filtering in Scala MLlib package is 'Alternative Least Squares with Weight Regularization'. The algorithm is described in the article ['Large-scale Parallel Collaborative Filtering for the Netflix Prize'](http://dl.acm.org/citation.cfm?id=1424269). Personally I would assume there are some other better algorithms out there. However, ALS is the one implemented in MLlib.

- The ALS assume that the rating matrix $$R$$ can be factorized into two matrices, a user-preference matrix $$U$$ and a preference matrix $$M$$.
- The loss function used in ALS is _rooted mean square error (RMSE)_ defined as 

$$\mathcal{L}(R,U,M) = \frac{1}{n}\sum_{i,j}(r_{i,j} - <u_{i},m_{j}>)^2$$,

where $$n$$ is the number of entries of the rating matrix $$R$$.

- The method uses L$$_2$$-norm regularization on the parameter space $$U$$ and $$M$$. Combining the loss function, the objective function of ALS can be defined as

$$\underset{U,M}{\min} \frac{1}{n}\sum_{i,j}(r_{i,j} - <u_{i},m_{j}>)^2 + \lambda (\sum_{i} n_{n_i} u_i^2+\sum_{i} n_{m_i} m_i^2)$$,

where $$\lambda$$ is the regularization parameter, and $$n_{u_i}$$ is the number of movies rated by user $$i$$, and $$n_{m_i}$$ is the number of users rating movies $$i$$.

- The above optimization problem is convex in terms of either $$U$$ and $$M$$. Therefore, it can be solved with an iterative approach where solving $$U$$ whiling fixing $$M$$ and vice versa.
- When fixing $$M$$ and optimizing $$U$$, the problem is equivalent to a collection of ridge regression problems where each subproblem takes $$u_i$$ as parameter and $$R, M$$ as constance. Therefore, it can be optimized in parallel in terms of $$u_i$$.
- In particular, the subproblem can be solve analytically as ridge regression.

###General information
- Collaborative filtering (CF) is heavily used in recommender system where the task is to find the missing values in the user-item association matrix.
- The following text combines the introduction of CF available from [MLlib](https://spark.apache.org/docs/latest/mllib-collaborative-filtering.html) and the [Tutorial](https://databricks-training.s3.amazonaws.com/movie-recommendation-with-mllib.html) for recommender system in Spark.
- The data file used here is from MovieLens `./spark-1.3.0-bin-hadoop2.4/data/mllib/als/sample_movielens_ratings.txt` with format `UserID::MovieID::Rating::Time`.
- The basic idea of the script is first to learn a ALS model on the training data with parameter selection on the validation data, and then to make predictions on the test data to measure the performance of the ALS model.
- See [THIS](http://hongyusu.github.io/mypages/code_recommender_CP_ALS.html) for the complete Python script.

###Details of the [Python script](http://hongyusu.github.io/myfiles/recommender_CP_ALS.py)
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


