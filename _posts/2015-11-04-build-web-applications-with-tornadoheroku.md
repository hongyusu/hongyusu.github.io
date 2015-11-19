---
layout: post
title: "Build web applications with Flask+Heroku"
description: ""
category: Programming 
tags: [Programming, Heroku, Python, Tornado, Web]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}


# Heroku deployment

- Create a virtual environment with the `virtualenv venv` which will generate the information as follows.

  {%highlight bash%}
  New python executable in venv/bin/python
  Installing setuptools, pip, wheel...done.
  {%endhighlight%}


- Install python packages in virtual environment with `pip`.

  {%highlight bash linenos%}
  $pip install tweepy
  $pip install flask
  $pip install numpy
  $pip install cPickle
  $pip install nltk
  $pip install scipy
  {%endhighlight%}

- Construct Python dependency file `requirements.txt` for heroku with the following command. 
 
  {%highlight bash linenos%}
  $pip freeze > requirements.txt
  {%endhighlight%}

- Write the `Procfile` with the following content to tell server which python script should be run.

  {%highlight bash linenos%}
  web: python app.py
  {%endhighlight%}

- Create an heroku instance with a predefined name.

  {%highlight bash linenos%}
  $heroku create sentimentx
  {%endhighlight%}

- Deploy the web application to heroku with the following command. The command will first copy all files to heroku server and deploy them afterwords. Of course, you need to have them ready already in Github e.g., all related files have been committed to Github local/remote. 

  {%highlight bash linenos%}
  $git push heroku master
  {%endhighlight%}


- Check if the submitted web services is running on Heroku remote service with the following command.

  {%highlight Bash linenos%}
  $heroku ps:scale web=1
  {%endhighlight%}

- Or open a browser window to the web service running in Heroku remote server with the following command.

  {%highlight Bash linenos%}
  $heroku open
  {%endhighlight%}


- Or run Heroku web services on local machine with the following command.

  {%highlight Bash linenos%}
  $heroku local
  {%endhighlight%}

- In case of problems that the web application cannot run on heroku server check log with the following command.

  {%highlight Bash linenos%}  
  $heroku logs
  {%endhighlight%}



- It is also nice to know some [limit](https://devcenter.heroku.com/articles/limits) of the Heroku server.

















