---
layout: post
title: "Cool stuff in NIPS 2016 (symposium)- Neural Art"
description: ""
category: Research
tags: [Research, NIPS, DeepLearning, Art]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}




# Neural art

This is also known as _neural style_. It is a recent work in the filed of _deep learning_ and it's super cool. I have noticed it for a while already and let's take a close look at technology behind the scene.

First off, what _neural art_ does is to render an input image A with the visual experience learnt from another input image B. Sometimes, this is known as _photorealistic rendering_. In other words, the **content** of image A remains while the **style** is changed to the one used in image B. The following pictures rendered by _neural art_ are from the original paper ([arxiv link](http://arxiv.org/abs/1508.06576)) where

1. Image A is the original input image to be rendered.
1. Image B is the rendered image using style of _The Shipwreck of the Minotaur_ by J.M.W.Turner, 1805.
1. Image C is the rendered image using style of _The Starry Night_ by Vincent van Gogh, 1889.
1. Image D is the rendered image using style of _Der Schrei_ by Edvard Munch, 1893.
1. Image E is the rendered image using style of _Femme nue assise_ by Pablo Picasso, 1910.
1. Image F is the rendered image using style of _Composition VII_ by Wassily Kandinsky, 1913.

For instance, the style shown in Van Gogh's _The Starry Night_ is somehow peaceful, clear, purified. Besides, it is with high contrast and also with clean color. Similar style has been render in image C. I don't really understand any art. But Chinese reader can check this [Zhihu page](https://www.zhihu.com/question/19708222) to find out why Vincent Van Gogh's art is super good.

![photo1]({{ site.url }}/myimages/ss_20160105.jpg)

# Technology behind the scene

I guess everything starts from the observation that deep neural network demonstrates near-human performance in the area of visual perception such as object and face recognition. Or sometimes, the performance is even better that human competitors. On the other hand, human has unique skill of creating a variety of visual experiences by playing around content and style of a arbitrary image. Then the question really is to understand how human create and perceive artistic imagery? Or from another perspective, how to algorithmically create a piece of art by combining style and content. The short answer is there is a technology driven by _Convolutional Neural Network_ (CNN). 

In particular, the algorithm is able to model the content and style independently.

## Content representation

CNN is a feed forward neural network in which each layer can be seen as a collection of image filters. Each filter extracts a certain feature from the input image. The output of each layer is a collection of feature maps composed by different filters. As a result, the input image is transformed into a series of transformations along the processing hierarchy that increasingly care about the actual content of the image rather than exact pixel values. One can reconstruct the origin image from each layer in which lower level layers will reproduce the original pixels while the high level ones will output contextual information. It is not difficult to see that it is relative easy to reproduce the original image from low level layers. However, the context of the image can be captured by high level layers. 

## Style representation

The style of an image is a bit tricky to capture. But remember we have a collection of feature maps in each layer of the deep neural network. The style feature is built on top of the content features. In particular, it consists of correlations between different context features. Thus, we end up with style features in multiple layers and thus have a stationary, multiple level style representation of the input image.

## Put together

Put together content representation and style representation, we end up a deep neural network model shown in the following picture. 

![photo2]({{ site.url }}/myimages/ss_20160105_3.jpg)

An input image is represented as a collection of filtered images in each layer of the neural network while the number of filtered image increases along the hierarchy of the network. The granularity of the content feature decrease along the hierarchy of the network in which high level layer captures more about content than the detailed pixel values.

On the top of the original CNN representation, there is a new feature space capturing the style information of the image. The style feature computes the correlation between different content features of each layer of the neural network. This features focus more on the details of the image and less on the global arrangement of the pixels when going deeper along the network hierarchy.

# More artwork

The followings are some other artwork produced by _neural art_ from [Github page](https://github.com/jcjohnson/neural-style).

![photo2]({{ site.url }}/myimages/ss_20160105_1.jpg)
![photo3]({{ site.url }}/myimages/ss_20160105_2.jpg)

# Other voices





