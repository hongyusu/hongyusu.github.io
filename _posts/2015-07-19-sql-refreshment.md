---
layout: post
title: "sql refreshment"
description: ""
category: Programming 
tags: [programming, SQL]
---
{% include JB/setup %}


1. `SELECT` statement: 

   {%highlight SQL%}
   select distinct name
   from empinfo
   where age > 40 and firstname like 'bob'
   {%endhighlight%}

   pay attention to `distinct` and `like` in `where` statement