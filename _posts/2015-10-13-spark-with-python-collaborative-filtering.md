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



# Table of content
* auto-gen TOC:
{:toc}


# Collaborative filtering in Spark MLlib

The algorithm implemented for collaborative filtering (CF) in Scala MLlib is 'Alternative Least Squares (ALS) with Weight Regularization'. The algorithm is described in the research paper ['Large-scale Parallel Collaborative Filtering for the Netflix Prize'](http://dl.acm.org/citation.cfm?id=1424269). I would assume some other better algorithms do exist out there. However, ALS is the one implemented in MLlib. So don't complaint. 

- The idea is similar as matrix factorization. In particular, ALS assumes that the rating matrix $$R$$ can be factorized into two matrices, a user-preference matrix $$U$$ and a preference-rating matrix $$M$$.
- The loss function used in ALS is so called _rooted mean square error (RMSE)_ defined as 

   $$\mathcal{L}(R,U,M) = \frac{1}{n}\sum_{i,j}(r_{i,j} - <u_{i},m_{j}>)^2$$,

   where $$n$$ is the number of entries in the rating matrix $$R$$.

- In addition, ALS applies L$$_2$$-norm regularization on the parameter spaces $$U$$ and $$M$$.
- Combine the loss function, the objective of ALS can be formulated as

   $$\underset{U,M}{\min} \frac{1}{n}\sum_{i,j}(r_{i,j} - <u_{i},m_{j}>)^2 + \lambda (\sum_{i} n_{n_i} u_i^2+\sum_{i} n_{m_i} m_i^2)$$,

   where $$\lambda$$ is the regularization parameter that controls the balance of the loss term and the regularization term, $$n_{u_i}$$ is the number of movies rated by user $$i$$, and $$n_{m_i}$$ is the number of users that rate movies $$i$$.

- The above optimization problem is convex in terms of either $$U$$ and $$M$$. Therefore, it can be solved with an iterative approach where solving $$U$$ whiling fixing $$M$$, and vice versa.
- When fixing $$M$$ and optimizing $$U$$, the problem is equivalent to a collection of ridge regression problems where each subproblem takes $$u_i$$ as parameter and $$R, M$$ as constance. Therefore, it can be optimized in parallel in terms of $$u_i$$.
- In particular, the subproblem can be solve analytically as a ridge regression.

# External sources
- ["Alternating least square method for collaborative filtering"](http://bugra.github.io/work/notes/2014-04-19/alternating-least-squares-method-for-collaborative-filtering/) is an OK blog about basic knowledge of ALS and CF. The blog post also includes some running Python code. However, it is not about Spark MLlib.
- ["Scalable Collaborative Filtering with Spark MLlib"](https://databricks.com/blog/2014/07/23/scalable-collaborative-filtering-with-spark-mllib.html) is a nice article from Databricks in which the performance of Spark MLlib is compared with Mahout. It is worth looking at the [actual code](https://github.com/databricks/als-benchmark-scripts) behind the scene.
- This [post](http://stackoverflow.com/questions/29160046/spark-mllib-collaborative-filtering-with-new-user/33118918#33118918) from Stackoverflow confirms my intuition that ALS in Spark-MLlib does not support the predictions for unseen users/movies. Basically, this means it would be tricky to select examples (ratings) to form training and test sets.
- [This](http://spark.apache.org/docs/latest/mllib-collaborative-filtering.html) is the original documentation of ALS in Spark.
- [Hand on exercises](https://databricks-training.s3.amazonaws.com/movie-recommendation-with-mllib.html) about recommender system in Spark origanized by Databricks.

# Spark Python code for ALS

##General information

- Collaborative filtering (CF) is heavily used in recommender system where the task is to find the missing values in the user-item association matrix.
- The following code is to use ALS algorithm implemented in Spark MLlib for recommendation.
- The data file used here is the well known [MovieLens dataset](http://grouplens.org/datasets/movielens/). In particular, two variants are used in the experiences reported in the following section:
  1. 1 million ratings from 6000 users on 4000 movies
  1. 10 million ratings from 70000 users on 11000 movies.
- The format of the file is `UserID::MovieID::Rating::Time`.
- The basic idea of the Python script:
  1. First select from original dataset two subsets, one for training and the other for test.
  1. I learn a ALS model based on training data which includes extensive parameter selections.
  1. The performance on training data is then compared with an naive imputation model known as mean imputation.
  1. After training phase, The model is applied on test data to estimate the preference of user-item pairs.
  1. The performance of the model on test data is again compared with the naive mean imputation method.
- The complete Python script for the experiment can be found from [my Github page](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/collaborative_filtering.py).
- Remember that you can monitor the progress of the running Python code from command line interface `lynx http://localhost:8080`.

## Results

### 1 million dataset

- Statistics of the dataset

  |Name|Number|
  |:--|--:|
  |ratings|        1000209|
  |training|       978241|
  |test|           21968|

- Parameter selections

  |Rank|$$\lambda$$|Iteration|RMSE|
  |:--:|:--:|:--:|:--:|
  |10|0.1|10|0.828997475929|
  |10|0.1|20|0.819212546853|
  |10|0.01|10|0.760192213987|
  |10|0.01|20|0.757669068652|
  |10|0.001|10|0.758776382891|
  |10|0.001|20|0.755268319674|
  |20|0.1|10|0.817451932118|
  |20|0.1|20|0.806853316306|
  |20|0.01|10|0.687958965914|
  |20|0.01|20|0.682085969698|
  |20|0.001|10|0.68817419318|
  |20|0.001|20|0.680732132614|
  |30|0.1|10|0.813478712938|
  |30|0.1|20|0.802717445363|
  |30|0.01|10|0.630678500028|
  |30|0.01|20|0.622970675939|
  |30|0.001|10|0.632233272558|
  |30|0.001|20|0.618354030429|
  |30|0.001|20|0.618354030429|

- Performance on training and test sets

  ||ALS|Mean imputation|
  |:--:|:--:|:--:|:--:|
  |Training|0.62|1.12|
  |Test|1.20|1.12|

- It seems that we should not overfit training data :relaxed:



## Coding details

- Python script of the following codes can be found from [HERE](https://github.com/hongyusu/SparkViaPython/blob/master/Examples/collaborative_filtering.py).
- To use Spark Python interface we have to include Spark-Python package

{% highlight Python linenos %}
from pyspark import SparkConf, SparkContext
from pyspark.mllib.recommendation import ALS
import itertools
from math import sqrt
import sys
from operator import add
{% endhighlight %}

- The next step is to configure the current python script with Spark context. In particular, we use local machine for testing the code and use cluster to run the script. 

{% highlight Python linenos %}
# set up Spark environment
APP_NAME = "Collaboratove filtering for movie recommendation"
conf = SparkConf().setAppName(APP_NAME)
conf = conf.setMaster('spark://ukko160:7077')
sc = SparkContext(conf=conf)
{% endhighlight %}

- After that, we have to read in the data file as RDD and take a look at the summary of the data

{% highlight Python linenos %}
# read in data
data = sc.textFile(filename)
ratings = data.map(parseRating)
numRatings  = ratings.count()
numUsers    = ratings.values().map(lambda r:r[0]).distinct().count()
numMovies   = ratings.values().map(lambda r:r[1]).distinct().count()
print "--- %d ratings from %d users for %d movies\n" % (numRatings, numUsers, numMovies)
{% endhighlight %}

- The `parseRating` function is defined as

{% highlight Python linenos %}
def parseRating(line):
  """
  Parses a rating record in MovieLens format userId::movieId::rating::timestamp.
  """
  fields = line.strip().split("::")
  return (int(int(fields[0])%10),int(int(fields[1])%10)), (int(fields[0]), int(fields[1]), float(fields[2]))
{% endhighlight %}

- Then we will partition the data into training, validation and test partitions. However,for the purpose of demonstration we use all data for training validation and test. In particular, we get all data from RDD and repartition the data.

{% highlight Python linenos %}
numPartitions = 10
training    = ratings.filter(lambda r: not(r[0][0]<=0 and r[0][1]<=1) ).values().repartition(numPartitions).cache()
test        = ratings.filter(lambda r: r[0][0]<=0 and r[0][1]<=1 ).values().cache()
numTraining = training.count()
numTest     = test.count()
print "ratings:\t%d\ntraining:\t%d\ntest:\t\t%d\n" % (ratings.count(), training.count(),test.count())
{% endhighlight %}

- After that we will run ALS with parameter selection on the training and validation sets. The performance of the model is measured with _rooted mean square error (RMSE)_.
# model training with parameter selection on the validation dataset

{% highlight Python linenos %}
ranks       = [10,20,30]
lambdas     = [0.1,0.01,0.001]
numIters    = [10,20]
bestModel   = None
bestValidationRmse = float("inf")
bestRank    = 0
bestLambda  = -1.0
bestNumIter = -1
for rank, lmbda, numIter in itertools.product(ranks, lambdas, numIters):
  model                   = ALS.train(training, rank, numIter, lmbda)
  predictions             = model.predictAll(training.map(lambda x:(x[0],x[1])))
  predictionsAndRatings   = predictions.map(lambda x:((x[0],x[1]),x[2])).join(training.map(lambda x:((x[0],x[1]),x[2]))).values()
  validationRmse          = sqrt(predictionsAndRatings.map(lambda x: (x[0] - x[1]) ** 2).reduce(add) / float(numTraining))
  print rank, lmbda, numIter, validationRmse
  if (validationRmse < bestValidationRmse):
    bestModel = model
    bestValidationRmse = validationRmse
    bestRank = rank
    bestLambda = lmbda
    bestNumIter = numIter
print bestRank, bestLambda, bestNumIter, bestValidationRmse 
print "ALS on train:\t\t%.2f" % bestValidationRmse
{% endhighlight %}

- Use mean imputation to test the performance on training data.

{% highlight Python linenos %}
meanRating = training.map(lambda x: x[2]).mean()
baselineRmse = sqrt(training.map(lambda x: (meanRating - x[2]) ** 2).reduce(add) / numTraining)
print "Mean imputation:\t\t%.2f" % baselineRmse
{% endhighlight %}

- The prediction of the best model on the test data can be computed from

{% highlight Python linenos %}
  # predict test ratings
  try:
    predictions             = bestModel.predictAll(test.map(lambda x:(x[0],x[1])))
    predictionsAndRatings   = predictions.map(lambda x:((x[0],x[1]),x[2])).join(test.map(lambda x:((x[0],x[1]),x[2]))).values()
    testRmse          = sqrt(predictionsAndRatings.map(lambda x: (x[0] - x[1]) ** 2).reduce(add) / float(numTest))
  except Exception as myerror:
    print myerror
    testRmse          = sqrt(test.map(lambda x: (x[0] - 0) ** 2).reduce(add) / float(numTest))
  print "ALS on test:\t%.2f" % testRmse
{% endhighlight %}

- We can also compare the performance of ALS with naive approach where we predict all ratings with the average ratings.

{% highlight Python linenos %}
# use mean rating as predictions 
meanRating = training.map(lambda x: x[2]).mean()
baselineRmse = sqrt(test.map(lambda x: (meanRating - x[2]) ** 2).reduce(add) / numTest)
print "Mean imputation:\t%.2f" % baselineRmse
{% endhighlight %}

- When everything is done, we will stop Spark context with the following Python command.

{% highlight Python linenos %}
# shut down spark
sc.stop()
{% endhighlight %}



