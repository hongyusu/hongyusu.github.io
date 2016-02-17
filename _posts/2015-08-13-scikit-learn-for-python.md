---
layout: post
title: "Scikit: A machine learning package for Python"
description: ""
category: Technology
tags: [Python, Scikit, MNIST]
---
{% include JB/setup %}


# Table of content
* auto-gen TOC:
{:toc}

# Instruction for installation

The installation of Scikit-learn package seems to require an administration right of the system. For example, if you install the package with `pip install`. However, it does not necessarily require an admin right. You can just install the package under your own directory, e.g., if you are on a computer cluster with shared filesystem. Just follow the following simple instructions.

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
1. For now, we use preprocessed handwriting digit data from [here](https://github.com/mnielsen/neural-networks-and-deep-learning/blob/master/data/mnist.pkl.gz).
1. `sklearn.cross_validation` module is used to randomly split the original MNIST dataset into training and test sets. In particular, we use 60000 handwriting digit for training and 10000 digits for test.
1. In this demo, we use linear SVMs without parameter selection. One can always use kernel functions (e.g., Gaussian kernel) with parameter tuning to achieve better result.
1. For the above setting, I get 9435/10000 writings correct.
1. The script is shown as the following

```python
from sklearn.datasets import fetch_mldata
from sklearn import svm
from sklearn.cross_validation import train_test_split
import numpy as np
from collections import Counter
import cPickle
import gzip
def svm_baseline():
  #mnist = fetch_mldata('MNIST original', data_home='../ScikitData')
  #Xtr,Xts,Ytr,Yts = train_test_split(mnist.data, mnist.target, test_size=10000, random_state=42)
  f = gzip.open('../ScikitData/mnist.pkl.gz','rb')
  training_data,validation_data,test_data=cPickle.load(f)
  f.close()
  model = svm.SVC()
  model.fit(training_data[0],training_data[1])
  predictions = [int(a) for a in model.predict(test_data[0])]
  num_corr = sum(int(a==y) for a,y in zip(predictions,test_data[1]))
  print "Baseline classifier using an SVM."
  print "%s of %s values correct." % (num_corr, len(test_data[1]))
  pass
if __name__ == '__main__':
  svm_baseline()
```

## Random Forest for MNIST dataset

1. Random forest classifier is implemented in `sklearn.ensemble` package.
1. For a random forest classifier the following paraemters should be specified.
   1. `n_estimators`, the number of trees in the forest.
   1. `max_depth`, the maximum depth of a tree.
1. In this demo, we use a random forest classifier with 10, 100, 500 random trees.
1. The result is shown in the following table

   |`n_estimators`|Performance|
   |:---:|:--:|
   |10  |9466/10000|
   |100 |9679/10000|
   |500 |9706/10000|
   |1000|9711/10000|

1. The training time of a random forest classifier is much faster that SVMs.
1. The Python script is shown as the following.

```python
from sklearn.datasets import fetch_mldata
from sklearn.ensemble import RandomForestClassifier
from sklearn.cross_validation import train_test_split
import numpy as np
from collections import Counter
import cPickle
import gzip
def rf_baseline():
  #mnist = fetch_mldata('MNIST original', data_home='../ScikitData')
  #Xtr,Xts,Ytr,Yts = train_test_split(mnist.data, mnist.target, test_size=10000, random_state=42)
  f = gzip.open('../ScikitData/mnist.pkl.gz','rb')
  training_data,validation_data,test_data=cPickle.load(f)
  f.close()
  model = RandomForestClassifier(n_estimators=1000, max_depth=None, min_samples_split=1, random_state=0)
  model.fit(training_data[0],training_data[1])
  predictions = [int(a) for a in model.predict(test_data[0])]
  num_corr = sum(int(a==y) for a,y in zip(predictions,test_data[1]))
  print "Baseline classifier using an Random Forest."
  print "%s of %s values correct." % (num_corr, len(test_data[1]))
  pass
if __name__ == '__main__':
  rf_baseline()
```

