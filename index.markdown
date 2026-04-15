---
layout: name
title: Home
section: Home
---

<img class='inset right' src='/images/hongyu_su.jpg' title='Hongyu Su' alt='Hongyu Su' width='120px' />

Welcome
=======

I'm Hongyu Su,
a [Ph.D](/work) in Machine Learning from [Aalto University](https://www.aalto.fi/en),
[data scientist](https://www.linkedin.com/in/hongyusu/) building ML systems in production,
[researcher](/work/) in optimization and structured prediction,
[publishing papers](/work/pubs/),
engineer and nerdy vim user,
licensed scuba diver ([AOW](https://en.wikipedia.org/wiki/Advanced_Open_Water_Diver) + [Nitrox](https://en.wikipedia.org/wiki/Nitrox)),
snowboarder, cat person, hiker, and [photographer][flickr].

Find more about my [research](/work), [writing](/blog), and [code](/code).

[flickr]: https://www.flickr.com/photos/123885344@N02/

<div class="section" markdown="1">
[Academia](/work)
========
Ph.D in Machine Learning from Aalto University. PostDoc at [Helsinki Institute for Information Technology HIIT](https://research.cs.aalto.fi/hiit/) and Aalto.
Research focus: optimization, structured output prediction, kernel methods, and large-scale learning.
</div>

<div class="section" markdown="1">
[Technical Blog](/blog)
=====
I write about machine learning, data science, data engineering, and software development. Recent posts:
{% for post in site.categories.blog limit:8 %}
<ul class="compact recent">
<li>
	<a href="{{ post.url }}" title="{{ post.excerpt }}">{{ post.title }}</a>
	<span class="date">{{ post.date | date_to_string }}</span>
</li>
</ul>
{% endfor %}
</div>

<div class="section" markdown="1">
[Code](/code)
=====
Open source projects on [GitHub](https://github.com/hongyusu) spanning ML research, web applications, and data engineering.
</div>
