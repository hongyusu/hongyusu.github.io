---
layout: post
title: "Build web applications with Flask+Heroku"
description: ""
category: Technology
tags: [Heroku, Python, Tornado, Web]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}


# Heroku deployment


- Create an heroku instance with a predefined name.

  ```bash
  $heroku create sentimentx
  ```

- Create a virtual environment with the `virtualenv venv` which will generate the information as follows.

  {%highlight bash%}
  New python executable in venv/bin/python
  Installing setuptools, pip, wheel...done.
  ```

- Install python packages with `pip` for the virtual environment we just created.

  ```bash
  $pip install tweepy
  $pip install flask
  $pip install numpy
  $pip install cPickle
  $pip install nltk
  $pip install scipy
  ```

- Still, we need to have a Python dependency file `requirements.txt` for `Heroku` to understand these required packages. As all necessary packages are installed with `pip`, we can collect package information with `freeze` shown as follows. 
 
  ```bash
  $pip freeze > requirements.txt
  ```

- It seems that packages are in good shape. However, there are some problems with `Heroku` to install `scipy` and `numpy` and probably `scikit-learn`. In practice, it means that a application with these packages can run nicely on local computer but won't run on `Heroku` remote server. The solution is to use a third party pre-build package with the following command. It is worth noting that the following pre-build package at least support `numpy==1.8.1` and `scipy==0.14.0`. So if you have a higher version of these two packages, you might want to consider lower version alternatives in case they don't work with `Heroku`.

  ```bash
  heroku buildpacks:set https://github.com/thenovices/heroku-buildpack-scipy
  ```

- Write the `Procfile` with the following content to tell `Heroku` server which python script should be activated.

  ```bash
  web: python app.py
  ```


- Deploy the web application to `heroku` with the following command. The command will first copy all files to `heroku` server and deploy them afterwords. Of course, you need to have them ready already in Github e.g., all related files have been committed to Github local/remote. 

  ```bash
  $git push heroku master
  ```


- To check if the submitted web services is running on `Heroku` remote service, you can use the following command.

  {%highlight Bash linenos%}
  $heroku ps:scale web=1
  ```

- Or open a browser window to the web service running in `Heroku` remote server with the following command.

  {%highlight Bash linenos%}
  $heroku open
  ```

- Or run `Heroku` web services on local machine with the following command.

  {%highlight Bash linenos%}
  $heroku local
  ```

- In case of problems that the web application did not run on `heroku` server check log with the following command.

  {%highlight Bash linenos%}  
  $heroku logs
  ```

- It is also nice to know some [limit](https://devcenter.heroku.com/articles/limits) of the Heroku server.

















