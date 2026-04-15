---
layout: blog
title: Blog Archive
top: Blog Archive
section: Blog Archive
---

All blog posts:

{% for post in site.categories.blog %}
{% assign currentyear = post.date | date: "%Y" %}
{% if currentyear != year %}
## {{ currentyear }}
{% assign year = currentyear %}
{% endif %}
<ul class="compact">
<li>
  {{ post.date | date: "%b %d" }} - <a href="{{ post.url }}">{{ post.title }}</a>
</li>
</ul>
{% endfor %}