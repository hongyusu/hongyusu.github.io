---
layout: imt-post
title: "GPU computation on Amazon EC2"
description: ""
category: Technology
tags: [GPU, Amazon]
---

This article is about running a deep learning algorithm _neural style_ on Amazone GPU instance.

# Table of content
* auto-gen TOC:
{:toc}


# Introduction

As mentioned in this previous blog post '[nips 2016 neural style](/research/2016/01/05/cool-thing-in-nips-2016-neural-style)', running this deep learning algorithm for image rendering is very computational intensive. It is pretty slow on a traditional CPU cluster. Naturally, we would like to run this algorithm on GPU to achieve a feasible computation. As long as you have a desktop/laptop, you have a CPU, but the problem is that not everyboday have a GPU. It seems to me that we have two options:

1. Purchase your own GPU and make a GPU cluster.
1. Use cloud computing services e.g., Amazon EC2.

I don't have the money to buy my own GPU cluster. Therefore, I will be using Amazon EC2 GPU computing services. The cost of computing is roughly **0.7 euro** per hour. 



# Installation


1. Install _torch 7_ manually

   Run the following command in terminal to install _torch 7_
   
   ```
   cd ~/
   curl -s https://raw.githubusercontent.com/torch/ezinstall/master/install-deps | bash
   git clone https://github.com/torch/distro.git ~/torch --recursive
   cd ~/torch; ./install.sh
   ```
   
   Remember to use `sudo` right during the installation. If you use Amazon EC2 GPU cluster with Amazon Machine Image (ami-2557e256), you do not have to worry about _torch 7_ as it is already installed for this machine image.
   
1. Install _loadcaffe_

   1. Take a look at the official website of _loadcaffee_ from [github](https://github.com/szagoruyko/loadcaffe) and follow the instucution there. Otherwise, please go ahead with the following steps.
   
   1. _loadcaffe_ has no _caffe_ dependency, but you need to install _protobuf_ with the following command

      `sudo apt-get install libprotobuf-dev protobuf-compiler`
	  
	   If two packages cannot be found from the repository, you need to update your `apt-get` with the following command
	   
	   `sudo apt-get update`
	   
	   And you will just be fine.
	  
   1. Then you should install _loadcaffe_ package by running the following command 

      `sudo luarocks install loadcaffe`
	  
	  In case that `luarocks` cannot find the _loadcaffe_ package, the problem can be solved with the following command at least in my case

      `sudo luarocks --from=https://raw.githubusercontent.com/torch/rocks/master/ install loadcaffe`
	  
	  Again you will just be fine.
   
   
1. Install _neural-style_

   1. Now we have environment ready. We should go ahead with real stuffs. Take a look at the _neural-style_ in [github](https://github.com/jcjohnson/neural-style).
   
   1. Clone the package with the following git command 

      `git clone git@github.com:jcjohnson/neural-style.git` 

   1. Get into the cloned directory and download _VGG_ model with the following command

      `sh models/download_models.sh`
 
   
   
# Running


1. Right now, running _neural-style_ is pretty straight-forward. In particular, you can try the following example code

   `th neural_style.lua -style_image examples/inputs/starry_night.jpg -content_image examples/inputs/tubingen.jpg`
   
1. After about 700 iteration, your rendering should be ready. Copy the result from Amazon EC2 to your local with the following command

   `scp -i SparkEC2Key.pem ubuntu@ec2-54-229-54-221.eu-west-1.compute.amazonaws.com:~/neural-style/*png ~/Desktop/`
   
   And yes, your Amazon EC2 instance is just like a normal server and can be accessed with `ssh` and `scp`.
   
1. Now the cool thing is that the running time is just about **2 mins** on **GPU** instead of very very long on **CPU**.

1. You also get intermediate pictures at 100, 200, ..., upto 1000 iterations.

   ![photo1](/images/ss_20160130_0.jpg){:width="600"}



   
   
   
# External reading materials

There are always some cool information available on the web. In particular, I find the following blogs useful.

1. [How to install Theano on Amazon EC2 GPU](http://markus.com/install-theano-on-aws/). This is s simple, clear, instructive blog about installing deep learning environment such as _theano_ and _cuda_ on Amazon EC2 GPU instance.

1. [Using covnet to detect facial keypoints](http://danielnouri.org/notes/2014/12/17/using-convolutional-neural-nets-to-detect-facial-keypoints-tutorial/) is a tutorial for [a kaggle competition](https://www.kaggle.com/c/facial-keypoints-detection/details/deep-learning-tutorial).

1. Jeff Barr's introductory blog post on the GPU computing with Amazon - ['build 3D streaming application with EC2's G2 instance'](https://aws.amazon.com/blogs/aws/build-3d-streaming-applications-with-ec2s-new-g2-instance-type/).




