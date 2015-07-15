---
layout: post
title: "Some useful Coding techniques"
description: ""
category: Programming
tags: [Programming, GitHub, Python]
---
{% include JB/setup %}

<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>


###Revert to some previous commit
   - Check all previous commits by
{% highlight bash%}
git log
{% endhighlight%}
   - Pick up a commit by commit code, e.g., 

	commit 955cd428160a6d61a260564b193b175ae26f43c2

   - As a alternative, you can check the commit with commit id in GitHub webpage or client.
   - Revert to the selected commit
{%highlight bash%}
git checkout 955cd428160a6d61a260564b193b175ae26f43c2
{%endhighlight%}

###Python
- Repeat a string
   {%highlight python%}
   'this is a string' * 100
   {%endhighlight%}

- Sort a list `nums` and return index
   {%highlight python%}

   >>> nums=[1,2,3,4,2,2,1,2,3,2,1,2,3,4,5]
   >>> ind = sorted(range(len(nums)), key = lambda x: nums[x])
   {%endhighlight%}

