---
layout: post
title: "One class classification with Scikit"
description: ""
category: Technology
tags: [Python, Scikit, MNIST]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}

# Introduction
One class SVM is very useful in the situations where

1. you have unbalanced classes, e.g. 99% positive labels vs 1% negative labels.
1. you only have examples from a single category but you want to identify examples that are not from this category (a.k.a abnormalities detection).

One class SVMs is quite similar as standard SVMs except that it aims to maximize the margin between the examples from one class and the origin. After that, if a test example is very close to the origin, it will be classified as abnormalities. 

# An example on MNIST

1. As an example, we will be working with MNIST dataset which includes 70000 images of hand writing digits.
1. For the purpose of applying one class SVMs, we aim to train a classifier with all 0 images and use it to classify the rest images.
1. The results is shown in the following table

   |Digit|Correct|All|
   |:---|:---:|:---:|
   |0 | 320 | 980
   |1 | 1135 | 1135
   |2 | 1032 | 1032
   |3 | 1010 | 1010
   |4 | 982 | 982
   |5 | 892 | 892
   |6 | 958 | 958
   |7 | 1028 | 1028
   |8 | 974 | 974
   |9 | 1009 | 1009

1. It is clear that the performance of one class SVM is poor in classifying the object from the training class. However, it is good at identifying abnormalities, e.g. all other digits except 0 are correctly classified as non-0 images.
1. An implementation with Python and scikit package is given as the following. Data and codes can also be found from [Github-ScikitExamples](https://github.com/hongyusu/ScikitExamples).
{% highlight Python linenos %}
from sklearn.datasets import fetch_mldata
from sklearn import svm
from sklearn.cross_validation import train_test_split
import numpy as np
from collections import Counter
import cPickle
import gzip
def oneclass_svm_baseline():
  #mnist = fetch_mldata('MNIST original', data_home='../ScikitData')
  #Xtr,Xts,Ytr,Yts = train_test_split(mnist.data, mnist.target, test_size=10000, random_state=42)
  f = gzip.open('../ScikitData/mnist.pkl.gz','rb')
  training_data,validation_data,test_data=cPickle.load(f)
  f.close()
  # build a one class svm model
  model = svm.OneClassSVM(nu=0.1,kernel='rbf',gamma=0.1)
  model.fit( training_data[0][training_data[1]==0] )    
  # make prediction
  for i in range(10):
    predictions = [int(a) for a in model.predict(test_data[0][test_data[1]==i])]
    num_corr = sum(int(a==1) for a in predictions)
    print "   %d   " % i,
    if i==0:
      print "%d of %d" % (num_corr, len(predictions))
    else:
      print "%d of %d" % (len(predictions)-num_corr, len(predictions))
  pass
if __name__ == '__main__':
  oneclass_svm_baseline()
{% endhighlight %}