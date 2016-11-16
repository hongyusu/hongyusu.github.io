---
layout: name
title: Home

section: Home
---

<img class='inset right' src='/images/hongyu_su.jpg' title='Hongyu Su' alt='Doctoral promotion photo of Hongyu Su' width='120px' />

Welcome
=======

I'm Hongyu Su, a Ph.D on Machine Learning, downhill snowboarding unprofessional, scuba diver, cat person, terrible guitar player, researcher, lead data scientist in a bank, nerdy vim user, hiker and [photographer][flickr], etc & etc.
Yeah, you certainly find more about me by clicking links [here](/work) and [there](/iem).  

[flickr]: https://www.flickr.com/photos/123885344@N02/

<div class="section" markdown="1">
Research
========
I got [Ph.D](/work) in Machine Learning from Aalto University and did [PostDoc](/work) in Helsinki Institute for Information Technology HIIT.
</div>

<div class="section" markdown="1">
Blogs
=====
I maintain a technical blog called [_Hacker & Hiker_](/iem) on machine learning and data science, where recent posts include:
{% for post in site.categories.iem limit:3 %}
<ul class="compact recent">
<li>
	<a href="{{ post.url }}" title="{{ post.excerpt }}">{{ post.title }}</a>
	<span class="date">{{ post.date | date_to_string }}</span> 
</li>
</ul>
{% endfor %}
</div>

<div class="section" markdown="1">
Code
=====
I have also just started another blog called [_Hacker & Hiker_](/sap) on data engineering and architecture, where recent posts include:
{% for sappost in site.categories.sap limit:3 %}
<ul class="compact recent">
<li>
	<a href="{{ sappost.url }}" title="{{ sappost.excerpt }}">{{ sappost.title }}</a>
	<span class="date">{{ sappost.date | date_to_string }}</span> 
</li>
</ul>
{% endfor %}
</div>

<div class="section" markdown="1">
[Twitter](http://twitter.com/hongyusu)
====================================
<a href="https://twitter.com/hongyusu" class="twitter-follow-button" data-show-count="false">Follow @hongyusu</a><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>


<div class="section" markdown="1">
[Reading](http://librarything.com/home/hongyu.su)
==============================================
<div id="w0f1b0d7d00e37043ea087e441ab7777f"></div><script type="text/javascript" charset="UTF-8" src="https://www.librarything.com/widget_get.php?userid=Hongyu.Su&theID=w0f1b0d7d00e37043ea087e441ab7777f"></script><noscript><a href="http://www.librarything.com/profile/Hongyu.Su">My Library</a> at <a href="http://www.librarything.com">LibraryThing</a></noscript>
</div>




