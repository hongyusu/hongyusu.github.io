


{%highlight python%}
import sys
import itertools
from math import sqrt
from operator import add
from os.path import join, isfile, dirname

from pyspark import SparkConf, SparkContext
from pyspark.mllib.recommendation import ALS

def parseRating(line):
    """
    Parses a rating record in MovieLens format userId::movieId::rating::timestamp .
    """
    fields = line.strip().split("::")
    return long(fields[0]) % 10, (int(fields[0]), int(fields[1]), float(fields[2]))

if __name__ == "__main__":
    
    # set up Spark environment
    APP_NAME = "recommender_CP_ALS"
    conf = SparkConf().setAppName(APP_NAME)
    #conf = conf.setMaster('spark://ukko178:7077')
    conf = conf.setMaster('local')
    sc = SparkContext(conf=conf)

    # map ratings to RDD
    data = sc.textFile('../spark-1.3.0-bin-hadoop2.4/data/mllib/als/sample_movielens_ratings.txt')
    ratings = data.map(parseRating)

    numRatings  = ratings.count()
    numUsers    = ratings.values().map(lambda r:r[0]).distinct().count()
    numMovies   = ratings.values().map(lambda r:r[1]).distinct().count()

    print "--- %d ratings from %d users for %d movies\n" % (numRatings, numUsers, numMovies)

    # training, validation, test partitions 
    numPartitions = 4
    training    = ratings.filter(lambda r:r).values().repartition(numPartitions).cache()
    validation  = ratings.filter(lambda r:r).values().repartition(numPartitions).cache()
    test        = ratings.filter(lambda r:r).values().cache()

    numTraining         = training.count()
    numValidation       = validation.count()
    numTest             = test.count()

    print "--- %d training %d validation %d test\n" % (numTraining, numValidation, numTest)

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
    predictions                  = bestModel.predictAll(test.map(lambda x:(x[0],x[1])))
    predictionsAndRatings        = predictions.map(lambda x:((x[0],x[1]),x[2])).join( test.map(lambda x:((x[0],x[1]),x[2]))).values()
    testRmse                     = sqrt(predictionsAndRatings.map(lambda x: (x[0] - x[1]) ** 2).reduce(add) / float(bestNumIter))

    # evaluate the best model on the test set
    print "Best rank %d, Best lambda %.1f, Best iteration %d, RMSE %.2f\n" % (bestRank, bestLambda,bestNumIter,testRmse) 
    
    # compare the best model with a naive baseline that always returns the mean rating
    meanRating = training.union(validation).map(lambda x: x[2]).mean()
    baselineRmse = sqrt(test.map(lambda x: (meanRating - x[2]) ** 2).reduce(add) / numTest)
    improvement = (baselineRmse - testRmse) / baselineRmse * 100
    print "The best model improves the baseline by %.2f percent\n" % (improvement)

    # shut down spark
    sc.stop()
{%endhighlight%}





