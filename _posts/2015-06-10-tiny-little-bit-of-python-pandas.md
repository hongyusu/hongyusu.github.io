---
layout: post
title: "Tiny little bit of Python Pandas"
description: ""
category: Programming
tags: [Python, Pandas]
---
{% include JB/setup %}


<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>


## Installations
----

This section describes how to install Python Pandas package on a MacOS based machine, including Cython installation, Numpy installation, and Pandas package installation.

### Install Cython

- Cython is used to install Numpy package.
- Cython can be downloaded from the [Cython project](http://cython.org).
- Unpack the Cython with the following command

```bash
tar -xzvf Cython-0.22.tar.gz
```

- Install Cython with following command

```bash
sudo python setup.py install
```

### Install Numpy
- Numpy is needed in Cython.
- Numpy can be cloned from [GitHub](git@github.com:numpy/numpy.git) with following command

```bash
git@github.com:numpy/numpy.git
```

- Install Numpy with the following commands

```bash
sudo python setup.py build
sudo python setup.py install
```

### Install Pandas
- Download Pandas from [GitHub](https://github.com/numpy/numpy) with the following command

```bash
git clone git@github.com:numpy/numpy.git
```

- Build and install Pandas package with the following command

```bash
sudo python setup build
sudo python setup build
```

- To be able to import Pandas directly in the Python interpreter, the following command is necessary

```bash
sudo python setup.py build_ext --inplace
```


## Make use of Python Pandas
----

   