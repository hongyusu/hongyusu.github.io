---
layout: post
title: "Xplanner in Junction Hackathon 2015"
description: ""
category: Competition 
tags: [Junction2015, Hackathon, Python, Web, Heroku, Programming]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}

# Junction Hackathon 2015

As a team of four with [Xiao](https://github.com/xiaohan2012), [Li](https://github.com/czli), and [Shen](https://github.com/icdishb), we join the [Junction Hackathon 2015](http://hackjunction.com), Helsinki. 

# Xplanner

The product prototype we delivered is a automatic trip planner which find you flight ticket, hotel, attractions, restaurants and oragnize your whole journey. 

## Motivations

- **Holiday!** Let's assume you have about two weeks' holiday and you want to organise a trip.

  ![photo4]({{ site.url }}/myimages/junction0.jpg)

- **Tickets?** First thing you need to do is to search for flight tickets. You want to find the most cost efficient flight tickets but the question is which city you want to fly first. If you want three cities then you have six different combinations. Oh, you still need to know which day you want to fly. To find good tickets, you need to do **a lot of** search.

  ![photo4]({{ site.url }}/myimages/junction1.jpg)

- **Hotels?** The next thing you need to do is to find the hotel to stay.

  ![photo4]({{ site.url }}/myimages/junction2.jpg)

- **Attractions?** The next thing is to find tourist attractions for different cities in order to make yourself a tourist.

  ![photo4]({{ site.url }}/myimages/junction3.jpg)

- **Restaurant?** Still, you are a food lover or a bear dreamer, you need to find good restaurants to eat dinners in different cities.

  ![photo4]({{ site.url }}/myimages/junction4.jpg)

- **Buddies?** If you are traveling alone, you probably want to find a buddy to travel together.

  ![photo4]({{ site.url }}/myimages/junction5.jpg)


## Product - [Xplanner](http://tripassistant.herokuapp.com)

After about 10 hours hard coding, we eventually announced our product [Xplanner](http://tripassistant.herokuapp.com) with permanent URL [tripassistant.herokuapp.com](http://tripassistant.herokuapp.com).

![photo4]({{ site.url }}/myimages/junction6.jpg)


## Technologies behind the scene

- Github
- Heroku web service
- Python `flask`
- APIs
  1. Finnair API
  1. Foursquare API
  1. whatever API
- Algorithm to find the cost-efficient flights
