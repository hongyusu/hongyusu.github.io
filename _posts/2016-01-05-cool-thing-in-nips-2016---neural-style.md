---
layout: post
title: "Cool stuff in NIPS 2015 (symposium)- Neural Style"
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




# Neural style

The deep learning algorithm, _Neural style_, is also known as _neural art_. Some similar algorithm techniques have been seen in so called _deep dream_. It is a recent work in the filed of _deep learning_, and of course it's super **cool**. The algorithm has been there for a few months already and I have noticed it for a while. Let's take a close look at technology behind the scene.

First off, what _neural style_ does is to render an input image A with the visual experience learnt from another input image B. Sometimes, this is known as _photorealistic rendering_. In other words, the **content** of image A remains while the **style** is changed to the one used in image B. The following pictures rendered by _neural style_ are from the original paper ([arxiv link](http://arxiv.org/abs/1508.06576)) where

1. Image A is the original input image to be rendered.
1. Image B is a rendered image using style of _The Shipwreck of the Minotaur_ by J.M.W.Turner, 1805.
1. Image C is a rendered image using style of _The Starry Night_ by Vincent van Gogh, 1889.
1. Image D is a rendered image using style of _Der Schrei_ by Edvard Munch, 1893.
1. Image E is a rendered image using style of _Femme nue assise_ by Pablo Picasso, 1910.
1. Image F is a rendered image using style of _Composition VII_ by Wassily Kandinsky, 1913.

For instance, the style shown in Van Gogh's _The Starry Night_ is somehow peaceful, clear, purified. Besides, it is with high contrast and also with clean color. Similar style has been render in image C. I don't really understand any art. But Chinese reader can check this [Zhihu page](https://www.zhihu.com/question/19708222) to find out why Vincent Van Gogh's art is super good.

![photo1]({{ site.url }}/myimages/ss_20160105.jpg)

# Technology behind the scene

I guess everything starts from the observation that deep neural network demonstrates near-human performance in the area of visual perception such as object and face recognition. Or sometimes, the performance is even better that human competitors. On the other hand, human has unique skill of creating a variety of visual experiences by playing around content and style of a arbitrary image. Then the question really is to understand how human create and perceive artistic imagery? Or from another perspective, how to algorithmically create a piece of art by combining style and content. The short answer is there is a technology driven by _Convolutional Neural Network_ (CNN). 

The key finding of this paper is that the representations of content and  style information in the CNN are separable. In particular, the algorithm is able to model the content and style independently.

## Content representation

CNN is a feed forward neural network in which each layer can be seen as a collection of image filters. Each filter extracts a certain feature from the input image. The output of each layer is a collection of feature maps composed by different filters. As a result, the input image is transformed into a series of transformations along the processing hierarchy that increasingly care about the actual content of the image rather than exact pixel values. One can reconstruct the origin image from each layer in which lower level layers will reproduce the original pixels while the high level ones will output contextual information. It is not difficult to see that it is relative easy to reproduce the original image from low level layers. However, the context of the image can be captured by high level layers. 

## Style representation

The style of an image is a bit tricky to capture. But remember we have a collection of feature maps in each layer of the deep neural network. The style feature is built on top of the content features. In particular, it consists of correlations between different context features. Thus, we end up with style features in multiple layers and thus have a stationary, multiple level style representation of the input image.

## Put together

Put together content representation and style representation, we end up a deep neural network model shown in the following picture. 

![photo2]({{ site.url }}/myimages/ss_20160105_3.jpg)

An input image is represented as a collection of filtered images in each layer of the neural network while the number of filtered image increases along the hierarchy of the network. The granularity of the content feature decrease along the hierarchy of the network in which high level layer captures more about content than the detailed pixel values.

On the top of the original CNN representation, there is a new feature space capturing the style information of the image. The style feature computes the correlation between different content features of each layer of the neural network. This features focus more on the details of the image and less on the global arrangement of the pixels when going deeper along the network hierarchy.

## Rendering

The image rendering is performed by finding an image that simultaneously matches the content representation of the photograph and the style representation of the respective piece of art. However, one might notice that the content and the style information of an image might not be perfectly separated. Therefore, the algorithm aims to minimize a cost function containing two terms at the same time. Details can be found from the original paper.

# Create your own neural style painting

## Deep dream web application

![photo4]({{ site.url }}/myimages/ss_20160106_0.jpg)

There is online implementation of the algorithm, sometimes known as _deep dream_. The online platform allows you to upload an image and render it with a default style. Follow [this link](http://deepdreamgenerator.com) in order to access the online _deep dream_.

## DeepForger twitter bot

![photo4]({{ site.url }}/myimages/ss_20160106_1.jpg)

_Deep dream_ might be the most easies way to render an image using the algorithm and technology of deep style. However, it is not able to render the input image based on a arbitrary style given by another input image. _DeepForger twitter bot_ is a valuable alternative. Follow [this link](https://twitter.com/DeepForger) to access this robot. 

What you need to do is just to send the robot two images, one is the image you want to render and the other is the image you want to use as the style. This is an extremely convenient way of create neural style especially when you are not in a big hurry or you don't have a linux machine. However, if you need to render a collection of images quickly and in a much more flexible way, you might want to continue reading to set up a standalone deep style machine running locally.





## Standalone implementation

A simple google search will give you many implementation of the same algorithm, for example

1. `neural-style` [Github](https://github.com/jcjohnson/neural-style)
1. `neural-artistic-style` [Github](https://github.com/andersbll/neural_artistic_style)

### Installation

I will be using the `neural-artistic-style` as this is relative easy to install and run. 
In particular, it should be fine with the following steps

1. Download the algorithm implementation from Github with `git clone git@github.com:andersbll/neural_artistic_style.git`.
1. Install `CUDAarry` package [link in Github](https://github.com/andersbll/cudarray).
1. Install `deeppy` package [link in Github](https://github.com/andersbll/deeppy).
1. There might be some obstacles during the installation of these two packages (at least in my case). Just be patient and install all Python package dependencies (e.g., `Pillow`, `PIL`, `JPEG`) and you will be fine.

### Run

Run the algorithm with the following command `python neural_artistic_style.py --subject images/tuebingen.jpg --style images/starry_night.jpg`. Unfortunately, this is very slow in my case with CPU.

# Criticisms  

Philosophically, I would argue that it is merely an advanced image filter than artificial intelligent. The way I see this deep learning algorithm is just two levels of representation, one for content modeled by CNN and another for style modeled by correlation. Therefore, it will never produce any new contents or styles. On the other hand, some people do think this algorithm is essentially producing _art_ or a mixture of original content and new style :laughing: All right, anyway, the definition of _art_ is very vague and maybe you can never tell yes from no :laughing:

Technically, I would argue that algorithm is not computationally efficient for large-scale commercial use. Also, if you don't have GPU computational power and running this algorithm on CPU, it will be very very slow. Besides, the algorithm does not tell the difference between portrait images and natural sceneries. This will be rather problematic in a way that the algorithm does not about human face which is somehow important in portrait rendering. 

# More artworks

Look at a portrait image being rendered by different art styles.

![photo1]({{ site.url }}/myimages/20160111_0.jpg)

![photo1]({{ site.url }}/myimages/20160111_1.jpg)
![photo1]({{ site.url }}/myimages/20160111_2.jpg)
![photo1]({{ site.url }}/myimages/20160111_3.jpg)
![photo1]({{ site.url }}/myimages/20160111_4.jpg)
![photo1]({{ site.url }}/myimages/20160111_5.jpg)

# _Cajal-Turing Club_ team

![photo1]({{ site.url }}/myimages/ns_0.jpg)

![photo1]({{ site.url }}/myimages/ns_1.jpg)

![photo1]({{ site.url }}/myimages/ns_3.jpg)

![photo1]({{ site.url }}/myimages/ns_4.jpg)

![photo1]({{ site.url }}/myimages/ns_5.jpg)

![photo1]({{ site.url }}/myimages/ns_6.jpg)

![photo1]({{ site.url }}/myimages/ns_7.jpg)








