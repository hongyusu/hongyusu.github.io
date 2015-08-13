---
layout: post
title: "Scikit: A machine learning package for Python"
description: ""
category: Programming
tags: [Python, Programming, Scikit]
---
{% include JB/setup %}


# Table of content
* auto-gen TOC:
{:toc}

# Installation

The installation of Scikit-learn package does not require admin right. Just following the following instructions. 

1. Get the Scikit-learn package from its [Github page](https://github.com/scikit-learn/scikit-learn) with the following command

   `git clone git@github.com:scikit-learn/scikit-learn.git`

1. Install the package under the current user directory with the following command

   `python install.py --user`

1. Compile the package with `make`

1. Now you are ready for Scikit-learn. Open a Python interpreter and import the package 

   `import sklearn`

1. For more details, please refer to the [Scikit-learn homepage](http://scikit-learn.org/stable/).

# Coding examples

## Support vector machines for MNIST dataset

1. Scikit uses an implementation of SVMs from [libSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/).
1. Use `sklearn.datasets` module to load MNIST data. There are 70000 handwriting digit in MNIST dataset.
1. `sklearn.cross_validation` module is used to randomly split the original MNIST dataset into training and test sets. In particular, we use 60000 handwriting digit for training and 10000 digits for test.
1. In this demo, we use linear SVMs without parameter selection. One can always use kernel functions (e.g., Gaussian kernel) with parameter tuning to achieve better result.
1. The script is shown as the following

{% highlight python linenos %}
from sklearn.datasets import fetch_mldata
from sklearn import svm
from sklearn.cross_validation import train_test_split
def svm_baseline():
  mnist = fetch_mldata('MNIST original', data_home='../ScikitData')
  Xtr,Xts,Ytr,Yts = train_test_split(mnist.data, mnist.target, test_size=10000, random_state=42)
  model = svm.SVC()
  model.fit(Xtr,Ytr)
  predictions = [int(a) for a in model.predict(Xts)]
  num_corr = sum(int(a==y) for a,y in zip(predictions,Yts))
  print "Baseline classifier using an SVM."
  print "%s of %s values correct." % (num_corr, len(Yts))
  pass
if __name__ == '__main__':
  svm_baseline()
{% endhighlight %}

