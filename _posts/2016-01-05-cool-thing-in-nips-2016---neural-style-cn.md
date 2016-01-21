---
layout: post
title: "2015年NIPS会议中酷炫的东西 - Neural Style"
description: ""
category: Research
tags: [NIPS, Research, DeepLearning, Art, Algorithm, MachineLearning, Chinese]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 


![photo1]({{ site.url }}/myimages/20160111_2.jpg)


# Table of content
* auto-gen TOC:
{:toc}

# 写在前面

说起来自己都觉得点奇怪，这篇其实是在翻译自己的一个文章，内容多少有点删减，去读原文的需要猛戳这里 [http://www.hongyusu.com/research/2016/01/05/cool-thing-in-nips-2016---neural-style/](http://www.hongyusu.com/research/2016/01/05/cool-thing-in-nips-2016---neural-style/).

# Neural style

今天给大家讲讲今年NIPS会议里很酷炫很好玩的一个东西。这个基于深度学习的算法，被他的作者起名为neural style，业内某些人士（盗版人士）有时候也称它为neural art。相似的深度学习算法也被应用在另外的一个非常有意思的东西里，最近被炒得很火，也许你最近也有听说过他的名字，他就是略有名气的deep dream。Neural style还算是一个非常新的工作，技术层面上也不是特别复杂，相关的内容最开始被发表在arxiv上面，之后发表在今年的NIPS的workshop里面。去年底的时候我就关注过这个酷酷的东西，今天就和大家一起看看这个酷炫东西背后隐藏的深度学习技术。

但是首先，让我们看看这个neural style到底是用来做什么的。其实很简单，这个深度学习算法会从一张照片中学习这张照片给他人带来的视觉体验，或者是说是这张照片的画风，之后呢，算法用相似的画风去渲染另一张照片，具体说就是在保持张照片的内容的同时，用第一张照片的画风去呈现第二张图片的内容。在计算机视觉领域，相似的工作被也称为photorealistic rendering。其实说白了neural style就是一个特别高大上的滤镜，拍一张照片扔进这个滤镜里面，出来就跟梵高画的一样，也能跟吕克贝松拍出来的一样。实际用起来其实挺也挺坑爹的，接着往下看你就知道了。好吧，还是不太明白这个算法是用来干什么用的，那我再来举个栗子，下面的几张图片是来自于neural style作者发表在arxiv上的的原文

1. 图片A是一张等待被渲染的照片
1. 图片B是一张渲染过后的照片，渲染所用的画风是来自于 The Shipwreck of the Minotaur by J.M.W.Turner, 1805.
1. 图片C是一张渲染过后的照片，渲染所用的画风是来自于 The Starry Night by Vincent van Gogh, 1889.
1. 图片D是一张渲染过后的照片，渲染所用的画风是来自于 Der Schrei by Edvard Munch, 1893.
1. 图片E是一张渲染过后的照片，渲染所用的画风是来自于 Femme nue assise by Pablo Picasso, 1910.
1. 图片F是一张渲染过后的照片，渲染所用的画风是来自于 Composition VII by Wassily Kandinsky, 1913.

比方说梵高的那张星空是那么的平静，干净，纯净。。。对比度超高。那么相似的画风就被学习并应用到了图片C上。好吧，我承认我根本不懂什么艺术，不过感兴趣的小伙伴可以自行脑补梵高的艺术，或者直接猛戳这个知乎 https://www.zhihu.com/question/19708222 去搞清楚为什么梵高是一个很伟大的画家啊。

![photo1]({{ site.url }}/myimages/ss_20160105.jpg)

# 背后的黑科技

I guess everything starts from the observation that very deep neural network demonstrates near-human performance in the area of visual perception such as object and face recognition, sometimes the performance is even better that human competitors (a lot of reference papers should be listed here in order to make this claim, however I was a bit loose here as this is merely a blog post). On the other hand, human has unique skill of creating a variety of visual experiences by playing around content and style of an arbitrary image. Then the question is really to understand how human create and perceive autistics? Or from another perspective, how to algorithmically create a piece of art by combining style and content. The short answer is through a technology driven by _Convolutional Neural Network_ (CNN). 

The key finding of this work is that the representations of content information and style information in the CNN are separable. In particular, the algorithm is able to model the content and style independently.

## 如何表述内容

CNN is a feed forward neural network in which each layer can be seen as a collection of image filters. Each filter extracts a certain feature from the input image. The output of each layer is a collection of feature maps composed by different filters. As a result, the input image is transformed into a series of transformations along the processing hierarchy that increasingly care about the actual content of the image rather than exact pixel values. One can reconstruct the origin image from each layer in which lower level layers will reproduce the original pixels while the high level ones will output contextual information. It is not difficult to see that it is relative easy to reproduce the original image from low level layers. In addition, we see that the context of the image can be captured by high level layers. 

## 如何表述画风

The style of an image is a bit tricky to capture. But remember we have a collection of feature maps in each layer of the deep neural network. The style feature is built on top of the content features. In particular, it consists of correlations between different context features. Thus, we end up with style features in multiple layers and have a stationary, multiple level style representation of the input image.

## 当内容遇到画风

Put together content representation and style representation, we end up with a deep neural network model shown in the following picture (picture taken from the original technical paper). 

![photo2]({{ site.url }}/myimages/ss_20160105_3.jpg)

An input image is represented as a collection of filtered images in each layer of the neural network while the number of filtered image increases along the hierarchy of the network. The granularity of the content feature decrease along the hierarchy of the network in which high level layer captures more about content than the detailed pixel values.

On the top of the original CNN representation, there is a new feature space capturing the style information of the image. The style feature computes the correlation between different content features of each layer of the neural network. This features focus more on the details of the image and less on the global arrangement of the pixels when going deeper along the network hierarchy.

## 渲染

Rendering is performed by finding an image that simultaneously matches the content representation of the first image and the style representation of the second image (a classical piece of art). However, one might notice that the content and the style information of an image might not be perfectly separated. Therefore, the algorithm aims to minimize a cost function which contains two terms at the same time. Details can be found from the original technical paper.

# 创建你自己的neural style图片

## Deep dream 网络服务

![photo4]({{ site.url }}/myimages/ss_20160106_0.jpg)

从前有个web端服务，其实就是个小页面，他实现了一个跟neural style很相似的深度学习算法，叫做deep dream。这个在线的工具允许你提交一个照片，然后生成一个很奇怪的照片。这个链接 http://deepdreamgenerator.com 会带你去到 deep dream. 对于Deep dream我也许可能或许理解的不太对，因为我还没有好好研读这个文章。

## DeepForger twitter 机器人

![photo4]({{ site.url }}/myimages/ss_20160106_1.jpg)

Deep dream或许是最简单的途径来使用这些深度学习算法生成奇奇怪怪图片。不过呢，Deep dream不能根据你的需求去渲染一张输入图片。那么在这个令人捉急时候DeepForger twitter机器人就来了。按照这个链接 https://twitter.com/DeepForger 去找到这个机器人。简单的说，你需要做的事情就是给这个机器人发两张照片，一张是你要渲染的照片包含着内容，另一张是你想用来做渲染的包括画风的照片。不得不说其实这个机器人是你在没有Linux机器或者机器里面没有装GPU的时候，你可以获得一个非常好的捷径。巴特，如果你很变态的想去渲染一群照片，那么这个机器人就会很捉急。想知道怎么做的又快又好呢，还要继续往下读。想要知道怎么做的更快更好呢，还要看后面几期的内容。

## GPU实现

谷歌搜索会告诉你，好吧，这个深度学习算法真的有很多不同的实现，而且这些实现大多都寄宿在Github上面。你理所应当知道Github是什么，以及知道版本控制软件的基本机制。然后看看实现，比方说

1. `neural-style` [Github](https://github.com/jcjohnson/neural-style)
1. `neural-artistic-style` [Github](https://github.com/andersbll/neural_artistic_style)


以下我用 `neural-artistic-style` 做一个栗子，因为这个是先看起来安装和执行都比较简单。按照以下的几步进行操作，应该就没什么问题吧，我猜

1. 用这个命令 git clone git@github.com:andersbll/neural_artistic_style.git 去Github上面克隆最新的版本。
1. 安装 `CUDAarry` 包 [Github链接](https://github.com/andersbll/cudarray)。
1. 安装 `deeppy` 包 [Github链接](https://github.com/andersbll/deeppy)。
1. 安装起来可能多少都会有一些些的问题，我觉得耐心点去安装所有Python需要的包比方说 Pillow, PIL, JPEG，就应该能搞定。

当你无障碍之行完上面的步骤之后，就可以通过这个命令去运行这个深度学习算法 python neural_artistic_style.py --subject images/tuebingen.jpg --style images/starry_night.jpg。但是这里我需要让你知道的是，如果你没有GPU，这个东西在CPU上运行超级慢。

# 不一样的声音  

不一样的声音其实就是我自己的声音。我一直都觉得neural style就是一个高级一点的照片滤镜，根本谈不上人工智能。换个角度来说，这个算法有两层抽象表示，一层用CNN去表示图片的内容信息，另一层用correlation表示画风。所以说呢，这个算法不可能产生新的画风或者新的内容。但是呢，很多人觉得这个深度学习方法非常酷，简直酷到没有朋友，所以就是人工智能啦。他们的观点是基于neural style是在内容与画风基础上生成艺术啊，艺术啊，艺术啊。我只能说艺术是一个反正我自己都说不清楚的东西。那么，一个很难去定义的东西，就看谁更会买东西啦。
技术上说，我觉得这个深度学习算法很难被用于大规模的商业化。谁用谁知道，如果你没有GPU的话，就基本run不出来结果。另外这个算法没有任何机制去识别人脸，哇塞，这个很重要的，比方说你扔一张人脸照片给他，他会把两只眼睛画的连你自己都不认识了，不信你看看下面生成的照片。人脸识别在机器学习和人工智能领域已经不是一个很难得东西了，结论很简单，neural style可以很容易有很大的提升空间。

# 更多黑科技渲染的照片

看看以下这张人物特写被neural style通过不同的画风进行的渲染。

![photo1]({{ site.url }}/myimages/20160111_0.jpg)

![photo1]({{ site.url }}/myimages/20160111_2.jpg)
![photo1]({{ site.url }}/myimages/20160111_1.jpg)
![photo1]({{ site.url }}/myimages/20160111_3.jpg)
![photo1]({{ site.url }}/myimages/20160111_4.jpg)
![photo1]({{ site.url }}/myimages/20160111_5.jpg)

# 期待时刻

我正在努力得搭建一个云端服务器以及创建相关的API，目的是把neural art的算法变成简单的API接口以及网络服务，这样我们就都可以多一个好玩的滤镜去渲染照片。目前试用亚马逊的AWS，之后可能会用阿里云服务。不知道哪个更好，各有什么问题，高手们可以私信授我以渔。那么最后一个问题来了，我多久能搭好这个服务呢，我看还是不要有奖竞猜的，猜对了我也没法提供奖金。

# _Cajal-Turing Club_ 小组

我一直在想也许我们这个小组的最终目的就是传递一些有或者意思的，或者有用的，或者酷酷的新科技，新突破，新发现，以及先行的实验和结果。目前的领域大概在人工智能，神经科学，认知科学，以及脑科学。原因很简单，人工智能跟脑科学是一对不可分割的好基友嘛。当然我们也有能理解梵高的小伙伴，看我们的logo多么白富美。以下是被neural art渲染过的神一般的队友们

![photo1]({{ site.url }}/myimages/ns_0.jpg)

![photo1]({{ site.url }}/myimages/ns_1.jpg)

![photo1]({{ site.url }}/myimages/ns_3.jpg)

![photo1]({{ site.url }}/myimages/ns_4.jpg)

![photo1]({{ site.url }}/myimages/ns_5.jpg)

![photo1]({{ site.url }}/myimages/ns_6.jpg)

![photo1]({{ site.url }}/myimages/ns_7.jpg)










