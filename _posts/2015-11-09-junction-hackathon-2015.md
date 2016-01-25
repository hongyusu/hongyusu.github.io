---
layout: post
title: "Xplanner in Junction Hackathon 2015"
description: ""
category: Competition 
tags: [Hackathon, Python, Web, Heroku]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}

# Junction Hackathon 2015

As a team of four with [Xiao](https://github.com/xiaohan2012), [Li](https://github.com/czli), and [Shen](https://github.com/icdishb), we had a great time in [Junction Hackathon 2015](http://hackjunction.com), Helsinki. 

# Xplanner

We deliver a product prototype, [Xplanner](http://tripassistant.herokuapp.com), which is an automatic trip planner that finds you flight tickets, hotels, attractions, restaurants and oragnizes everything into a consistent time line. 

## Motivations

- **Holiday!** You happen to have about two weeks' free time and you want to take a holiday to the following three cities.

  ![photo4]({{ site.url }}/myimages/junction0.jpg)

- **Tickets?** First thing you need to do is to search for flight tickets. You want to find the most cost-efficient flight tickets but the question is which city you want to fly first. If you want three cities then you have six options ($$3\times2\times1=6$$). Oh, you still need to know which day you want to fly. To find good tickets, you need to do **a lot of** search.

  ![photo4]({{ site.url }}/myimages/junction1.jpg)

- **Hotels?** The next thing you need to do is to find hotels for each destination.

  ![photo4]({{ site.url }}/myimages/junction2.jpg)

- **Attractions?** Holiday quite often means sight-seeing. So you need to find a collection of tourist attractions for different cities in order to make yourself a tourist.

  ![photo4]({{ site.url }}/myimages/junction3.jpg)

- **Restaurants?** Things get more complicated if you are a food-lover or you like beers. I do. Good restaurants are quite indispensable for different cities as well.

  ![photo4]({{ site.url }}/myimages/junction4.jpg)

- **Buddies?** If you are traveling alone, you probably want to find a buddy to travel together.

  ![photo4]({{ site.url }}/myimages/junction5.jpg)


## Product - [Xplanner](http://tripassistant.herokuapp.com)

After 10 hours hard coding, we eventually announced our prototype [Xplanner](http://tripassistant.herokuapp.com) with permanent URL [tripassistant.herokuapp.com](http://tripassistant.herokuapp.com).

![photo4]({{ site.url }}/myimages/junction6.jpg)


## Technologies behind the scene

- Github
- Heroku web service
- Python `flask`
- APIs
  1. Finnair API
  1. Foursquare API
  1. `whatever` API
- Algorithms to find the cost-efficient flights
