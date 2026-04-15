---
layout: blog
title: Technical Blog
top: Blog
section: Blog

feed: /blog/atom.xml
---

I write about machine learning, data science, data engineering, and software development. 

Recent posts:
<div class="section">
{% for post in site.categories.blog limit:10 %}
<ul class="compact recent">
<li>
  <a href="{{ post.url }}" title="{{ post.excerpt }}">{{ post.title }}</a>
  <span class="date">{{ post.date | date_to_string }}</span> 
</li>
</ul>
{% endfor %}
</div>

See the complete [archive](past/) of all posts, or subscribe to the [RSS feed](atom.xml).