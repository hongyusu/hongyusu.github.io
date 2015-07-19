---
layout: post
title: "SQL refreshment"
description: ""
category: Programming 
tags: [programming, SQL]
---
{% include JB/setup %}


1. `select` statement.

   {%highlight SQL%}
   select distinct name
   from empinfo
   where age > 40 and firstname like 'bob'
   {%endhighlight%}

   pay attention to `distinct` and `like` in `where` statement.

1. Aggregate functions include `min`, `max`, `sum`, `avg`, `count`, and `count(*)` where return the number of rows.

1. `group by` statement.

   {%highlight SQL%}
   select max(salary), department
   from empinfo
   group by department
   {%endhighlight%} 