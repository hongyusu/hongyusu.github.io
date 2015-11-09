---
layout: post
title: "Build web applications with Tornado+Heroku"
description: ""
category: Programming 
tags: [Programming, Heroku, Python, Tornado, Web]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}


# Heroku

- Run Heroku web services on local machine with the following command.

  {%highlight Bash linenos%}
  $heroku local
  {%endhighlight%}

- Submit web services to Heroku server and activate the service on Heroku remote server with the following command.

  {%highlight Bash linenos%}
  $git commit -u heroku master
  {%endhighlight%}

- Check if the submitted web services is running on Heroku remote servce with the following command.

  {%highlight Bash linenos%}
  $heroku ps:scale web=1
  {%endhighlight%}

- Open a browser window to the web service running in Heroku remote server with the following command.

  {%highlight Bash linenos%}
  $heroku open
  {%endhighlight%}

- It is also nice to know some [limit](https://devcenter.heroku.com/articles/limits) of the Heroku server.



