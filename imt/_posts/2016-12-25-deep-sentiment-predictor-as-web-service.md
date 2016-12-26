---
layout: imt-post
title: "Deep Sentiment Prediction as Web Service"
description: ""
category: Programming
tags: [Programming, DeepLearning, Heroku]
---


I have been thinking for a long while to build a web service for sentiment analysis, the idea of which is tell the emotional positivity (negativity) given a piece of text.  Despite of the potentially huge and interesting applications or use-cases, we will be focusing the sentiment analysis for tweets. 
Basically this article is telling what happened and how.

As a short summary, I have trained a sentiment prediction model using IMDB review data.
The model is essentially a Convonlutional Neural Network (CNN) using pretrained sentiment140 word2vec as embedding layer.
The implementation of the model is through Keras API running tensorflow as backend.
The web service is built with Python flask and hosted in Heroku.

Online demo lives in Heroku accessible via [http://sentipred.heroku.com](http://sentipred.heroku.com). A bit slow when loading the page but have fun!

 
# Table of content
* auto-gen TOC:
{:toc}


# Design

The architechture is not very compilcated as shown in the following picture.

![photo1](/images/architecture_sentiment_predictor.jpg){:width="600"}

There are two major components, offline training to make a model, a web service utilizing the model for scoring.
As tensorflow is running as backend, model training can be done either via CPU or via GPU. 
Prediction or scoring can only be perform with GPU since currently there is no GPU available for Heroku dyno.
In addition, the load balancing is taken care of by Heroku itself. 

# Code Repository 

There should always be a [link](http://www.hongyusu.com/sentiment_predictor/) to the [real stuffs](http://www.hongyusu.com/sentiment_predictor/).


# Deep Learning Model for Sentiment Prediction

1. Full code for learning part can be found from [sentiment_predictor.py](https://github.com/hongyusu/sentiment_predictor/blob/master/sentiment_predictor.py).

1. A wrapper that ommunicats with Twitter via Tweeter API can be found from [wrappter_twitter.py](https://github.com/hongyusu/sentiment_predictor/blob/master/sentiment_predictor.py). 


# Web Application via Python Flask

1. Full code can be found from [here](https://github.com/hongyusu/sentiment_predictor/blob/master/app.py). 

1. When the url is called, a front page (_index.html_) will be display which is defined by the following code block in _flask_

   ```python
   @app.route('/')
   def index(name=None):
       return render_template('index.html')
   ```

1. There is a button defined in _index.html_, and when clicked an action is triggered. The result is computed by the following code block again in _flask_

   ```python
   @app.route('/action1', methods=['POST'])
   def action1(name=None):
       ht = request.get_json()
       cPickle.dump(ht,open("hashtag.pickle","wb"))
       print "---> {} : started".format(ht)
       os.system("python wrapper_twitter.py")
       while True:
           if os.path.isfile("hashtag_res.pickle"):
               try:
                   data = cPickle.load(open("hashtag_res.pickle","r+"))
                   os.system("rm hashtag_res.pickle")
                   print "---> {} : ended".format(ht)
                   break
               except:
                   pass
       return flask.jsonify(data)
   ```

1. Once the web service is ready, it can be activated offline

   ```bash
   python app.py
   ```
   and tested offline by accessing _localhost:5000_ 

# Host the Application with Heroku 

1. Install virtual environment, the only step requires _sudo_ right

   ```bash
   sudo python install virtualenv
   ``` 

1. Set up a new virtual environment and name it with _venv_

   ```bash
   virtualenv venv
   ```

1. Activate the virtual environment

   ```bash
   souce ./venv/Scripts/activate
   ```

1. Install all requirement Python packages

   ```bash
   pip install keras==1.0.3       
   pip install theano==0.8.2       
   pip install tensorflow==0.12.0rc0       
   pip install pandas==0.19.1       
   pip install sklearn==0.08.1       
   pip install flask==0.11.1       
   pip install tweep==3.5.0       
   pip install h5py==2.6.0
   ```

1. Create a dependency file _requirement.txt_ which includes all packages and patterns. We do this via

   ```bash
   pip freeze > requirement.txt
   ```

1. Tensorflow needs some special treatment (revision) to the requirement file. So remove the tensor flow line, something like

   ```bash
   tensorflow==0.10.0
   ```

   and add one line

   ```bash
   https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-0.10.0-cp27-none-linux_x86_64.whl
   ```

1. Create a _runtime.txt_ file and add the following line to declare python version used in this web app

   ```bash
   python-2.7.12
   ```

1. Create a _Procfile_ file and add the following line to specify how to run the application when deployed

   ```bash
   web: bin/web
   ```

   also create the _bin/web_ file with the following content

   ```bash
   python app.py
   ```

1. Version control via Git all required files. 

1. Push to Heroku repository 

   ```bash
   git push -u heroku master
   ```

