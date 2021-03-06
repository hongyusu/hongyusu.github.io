---
layout: imt-post 
title: "2015年NIPS会议中酷炫的东西 - Neural Style"
description: ""
category: Research
tags: [NIPS, DeepLearning, Chinese]
---

 
NIPS是理论机器学习人工智能领域顶级的学术会议。NIPS论文的接受率相比其他顶级机器学习会议（ICML，AISTATS，ICCV，CVPR）略低。NIPS会议偏好一些理论性很强的工作，开创性和前瞻性的工作，以及里程碑性的工作。自己也曾被导师邀请审过历年NIPS的文章，审稿过程中最经常问自己的问题就是，手上这篇文章是原创性的还是建立在之前工作基础上的，跟后者沾边的文章基本夭折。有些刚刚步入机器学习和人工智能的小伙伴可能会有疑问，为什NIP文章的引用率会比其他机器学习会议文章引用率偏低，其实原因很简单嘛，因为大多数人都读不懂NIPS文章，看不懂怎么去引用啊。翻开就是一页一页数学公式的学术论文，我用真心向明月啊，我读你知道我缺不知道啊。不过我认为数学向来以简洁准确通用著称，我想这也是NIPS的魅力之一吧。身为一个机器学习人工智能的从（lan）业（ling）人（gong）员（ren），去年12月我也飞去这个又黑又冷的蒙特利尔，去让自己的智商被无数次的凌辱，凌辱，凌辱。在接下来的几个帖子里面，我会陆续总（zi）结（can）2015年NIPS的点点滴滴。

那第一期先不自残了，给大家说一个今年NIPS里面灰常好玩的一个东西。

* auto-gen TOC:
{:toc}


# Neural style

今天给大家讲讲今年NIPS会议里很酷炫很好玩的一个东西。这个基于深度学习的算法，被他的作者起名为neural style，业内某些人士（盗版人士）有时候也称它为neural art。相似的深度学习算法也被应用在另外的一个非常有意思的东西里，最近被炒得很火，也许你最近也有听说过他的名字，他就是略有名气的deep dream。Neural style还算是一个非常新的工作，技术层面上也不是特别复杂，相关的内容最开始被发表在arxiv上面，之后发表在今年的NIPS的workshop里面。文章的题目叫做A neural algorithm of artistic style，这里免费赠送文章在arxiv中的链接http://arxiv.org/pdf/1508.06576v2.pdf。去年底的时候我就关注过这个酷酷的东西，今天就和大家一起看看这个酷炫东西背后隐藏的深度学习技术。

但是首先，让我们看看这个neural style到底是用来做什么的。其实很简单，这个深度学习算法会从一张照片中学习这张照片给他人带来的视觉体验，或者是说是这张照片的画风，之后呢，算法用相似的画风去渲染另一张照片，具体说就是在保持张照片的内容的同时，用第一张照片的画风去呈现第二张图片的内容。在计算机视觉领域，相似的工作被也称为photorealistic rendering。其实说白了neural style就是一个特别高大上的滤镜，拍一张照片扔进这个滤镜里面，出来就跟梵高画的一样，也能跟吕克贝松拍出来的一样。实际用起来其实挺也挺坑爹的，接着往下看你就知道了。好吧，还是不太明白这个算法是用来干什么用的，那我再来举个栗子，下面的几张图片是来自于neural style作者发表在arxiv上的的原文

1. 图片A是一张等待被渲染的照片。
1. 图片B的渲染用的画风是 The Shipwreck of the Minotaur by J.M.W.Turner, 1805.
1. 图片C的渲染用的画风是 The Starry Night by Vincent van Gogh, 1889.
1. 图片D的渲染用的画风是 Der Schrei by Edvard Munch, 1893.
1. 图片E的渲染用的画风是 Femme nue assise by Pablo Picasso, 1910.
1. 图片F的渲染用的画风是 Composition VII by Wassily Kandinsky, 1913.

比方说梵高的那张星空是那么的平静，干净，纯净。。。对比度超高。那么相似的画风就被学习并应用到了图片C上。好吧，我承认我根本不懂什么艺术，不过感兴趣的小伙伴可以自行脑补梵高的艺术，或者直接猛戳这个知乎 https://www.zhihu.com/question/19708222 去搞清楚为什么梵高是一个很伟大的画家啊。

![photo1](/images/ss_20160105.jpg){:width="600"}

# 背后的黑科技

我自己觉得，这所有的一切的一切都是来源于对细微处的观察跟思考。最近的几年，在很多领域，深度学习都了接近人的能力，比方说在视觉感知，物体识别，人脸识别，图像分类等等的问题上面。更厉害的是，在很多问题上，通过深度学习算法取得的正确率居然远远超过了人工。这句话是一个很强的论断，我应该放很多paper在这里支持这句话，不过这毕竟是写博客，不需要那么谨慎。但是你千万不要觉得人类就被机器战胜了，我们人类厉害的地方在于可以玩转内容跟风格，从而产生不同视觉体验的图像。那么问题来了，我们是如何生成和感知艺术的，那人工智能可不可以通过同样的方法通过内容跟风格两个组成分去生成艺术呢？简单来说，当然可能啦，什么事情都是可能的嘛。稍微复杂一点，我们可以通过卷积神经网络去生成艺术。

这个深度学习的主要发现在于，一件艺术品的内容跟风格是可以被分开建模的。具体来说，一个可以分来模拟内容跟风格从而生成艺术图片的深度学习算法，这个可以有。

## 如何表述内容

Neural style这个酷酷的深度学习算法主要基于卷积神经网络CNN，不太了解卷积神经网络CNN的小伙伴，这里很抱歉要自行脑补了。CNN可以被看作是一个feed forward多层的神经网络，其中每一层可以被看作是由一系列的filtered image组成的。每一个filtered image是由原始图片经过一个image filter的到，从而filtered image包含原始图片的部分信息。需要注意的是，神经网路的层级越深，里面所包括的image filter跟由此产生的filtered image会变得越来越多，在这里，我们使用downsampling的方法，比方说常见的max pooling function去减少每一层的神经元数目。神经网络每一层的输出可以看作是由filtered image构成的一系列的feature map。在训练CNN做图像识别的时候，图像被转换成了一层一层的抽象表示，并且越高的层次的抽象表示越关注图片的内容，越低层次的抽象表示越关注于图像具体的橡塑信息。

## 如何表述画风

画风这种说不清道不明的东西，要建个数学模型去表示很真的不太容易。不过你还记得么，在之前那个卷积神经网络CNN里面有很多层啊，每层有很多feature map啊。画风的表示就是建立在这些feature map上面的呢。具体来说，就是算一算这些feature map之间的correlation。这样做的结果呢，就是在卷积神经网络CNN的每一层，我们都可以获得一组额外的feature map去描述一张图片的画风。

## 当内容遇到画风

当内容表示遇上风格表示，我们就得到了一个很厉害深度学习模型。这个模型的具体结构可以在下面的图片中看得更清楚，图片来源于原文章。

![photo2](/images/ss_20160105_3.jpg){:width="600"}

上半部分是用来抽象画风的神经网络结构，下半部分是用来抽象内容的神经网络结构。

## 渲染

其实渲染要做的事情就是就是生成一张图片，这张生成的图片可以完美匹配第一张图片里面的内容信息跟第二张图片里面的画风信息。然而聪明伶俐的你可能已经发现了问题，一张图片的内容跟画风是真的是应该很纠结的，并不能说分开就分开，跟谈恋爱还很不一样。因此，在数学层面，这个深度学习算法要做的其实就是解决一个优化问题：最小化一个cost function，这个function包括两部分，一部分代表内容，另一部分代表画风。具体的公式呢，我们还是要仔细的看看paper，因为我觉得数学的东西，用文字其实很难说清楚。

# 创建你自己的neural style图片

## Deep dream 网络服务

![photo4](/images/ss_20160106_0.jpg){:width="600"}

从前有个web端服务，其实就是个小页面，他实现了一个跟neural style很相似的深度学习算法，叫做deep dream。这个在线的工具允许你提交一个照片，然后生成一个很奇怪的照片。这个链接 http://deepdreamgenerator.com 会带你去到 deep dream. 对于Deep dream我也许可能或许理解的不太对，因为我还没有好好研读这个文章。

## DeepForger twitter 机器人

![photo4](/images/ss_20160106_1.jpg){:width="600"}

Deep dream或许是最简单的途径来使用这些深度学习算法生成奇奇怪怪图片。不过呢，Deep dream不能根据你的需求去渲染一张输入图片。那么在这个令人捉急时候DeepForger twitter机器人就来了。按照这个链接 https://twitter.com/DeepForger 去找到这个机器人。简单的说，你需要做的事情就是给这个机器人发两张照片，一张是你要渲染的照片包含着内容，另一张是你想用来做渲染的包括画风的照片。不得不说其实这个机器人是你在没有Linux机器或者机器里面没有装GPU的时候，你可以获得一个非常好的捷径。巴特，如果你很变态的想去渲染一群照片，那么这个机器人就会很捉急。想知道怎么做的又快又好呢，还要继续往下读。想要知道怎么做的更快更好呢，还要看后面几期的内容。

## GPU实现

谷歌搜索会告诉你，好吧，这个深度学习算法真的有很多不同的实现，而且这些实现大多都寄宿在Github上面。你理所应当知道Github是什么，以及知道版本控制软件的基本机制。然后看看实现，比方说

1. `neural-style` Github链接[https://github.com/jcjohnson/neural-style](https://github.com/jcjohnson/neural-style)
1. `neural-artistic-style` Github链接[https://github.com/andersbll/neural_artistic_style](https://github.com/andersbll/neural_artistic_style)


以下我用 `neural-artistic-style` 做一个栗子，因为这个是先看起来安装和执行都比较简单。按照以下的几步进行操作，应该就没什么问题吧，我猜

1. 用这个命令 git clone git@github.com:andersbll/neural_artistic_style.git 去Github上面克隆最新的版本。
1. 安装 `CUDAarry` 包 Github链接[https://github.com/andersbll/cudarray](https://github.com/andersbll/cudarray)。
1. 安装 `deeppy` 包 Github链接[https://github.com/andersbll/deeppy](https://github.com/andersbll/deeppy)。
1. 安装起来可能多少都会有一些些的问题，我觉得耐心点去安装所有Python需要的包比方说 Pillow, PIL, JPEG，就应该能搞定。

当你无障碍之行完上面的步骤之后，就可以通过这个命令去运行这个深度学习算法 python neural_artistic_style.py --subject images/tuebingen.jpg --style images/starry_night.jpg。但是这里我需要让你知道的是，如果你没有GPU，这个东西在CPU上运行超级慢。

# 不一样的声音  

不一样的声音其实就是我自己的声音。我一直都觉得neural style就是一个高级一点的照片滤镜，根本谈不上人工智能。换个角度来说，这个算法有两层抽象表示，一层用CNN去表示图片的内容信息，另一层用correlation表示画风。所以说呢，这个算法不可能产生新的画风或者新的内容。但是呢，很多人觉得这个深度学习方法非常酷，简直酷到没有朋友，所以就是人工智能啦。他们的观点是基于neural style是在内容与画风基础上生成艺术啊，艺术啊，艺术啊。我只能说艺术是一个反正我自己都说不清楚的东西。那么，一个很难去定义的东西，就看谁更会买东西啦。
技术上说，我觉得这个深度学习算法很难被用于大规模的商业化。谁用谁知道，如果你没有GPU的话，就基本run不出来结果。另外这个算法没有任何机制去识别人脸，哇塞，这个很重要的，比方说你扔一张人脸照片给他，他会把两只眼睛画的连你自己都不认识了，不信你看看下面生成的照片。人脸识别在机器学习和人工智能领域已经不是一个很难得东西了，结论很简单，neural style可以很容易有很大的提升空间。

# 更多黑科技渲染的照片

看看以下这张人物特写被neural style通过不同的画风进行的渲染。

![photo1](/images/20160111_0.jpg){:width="600"}

![photo1](/images/20160111_2.jpg){:width="600"}
![photo1](/images/20160111_1.jpg){:width="600"}
![photo1](/images/20160111_3.jpg){:width="600"}
![photo1](/images/20160111_4.jpg){:width="600"}
![photo1](/images/20160111_5.jpg){:width="600"}



# 写在后面

说起来自己都觉得点怪怪得，这篇文章其实是在翻译自己之前写的一个文章，内容多少有点删减，去读原文的话，下伙伴们需要猛戳这里[http://www.hongyusu.com/research/2016/01/05/cool-thing-in-nips-2016---neural-style/](/imt/research/cool-thing-in-nips-2016-neural-style.html)。本文也可以猛戳这里看到[http://www.hongyusu.com/research/2016/01/21/cool-thing-in-nips-2016---neural-style-cn/](/imt/research/cool-thing-in-nips-2016-neural-style-cn.html).




