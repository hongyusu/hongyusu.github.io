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

# Table of content
* auto-gen TOC:
{:toc}

##Git

###Remove bad commit from remote
- Move head to the good commit `git reset --hard <good commit id>`
- Force push the good commit to git `git push origin HEAD --force`

###Revert to some previous commit
- Check all previous commits by `git log`
- Pick up a commit by commit code, e.g., 

	commit 955cd428160a6d61a260564b193b175ae26f43c2

- As a alternative, you can check the commit with commit id in GitHub webpage or client.
- Revert to the selected commit
{%highlight bash%}
git checkout 955cd428160a6d61a260564b193b175ae26f43c2
{%endhighlight%}

###Remove files from Git but keep local copies
- Check files that are tracked by Git
{% highlight bash%}
git ls-files
{% endhighlight%}

- Remove files from Git tracking system
{%highlight bash%}
git rm --cached filename
{%endhighlight%}

- Check the revision of the repository
{%highlight bash%}
git status
{%endhighlight%}

- Modify the tracked file list
{%highlight bash%}
git add -u
{%endhighlight%}

- Commit changes
{%highlight bash%}
git commit -m'commit message'
{%endhighlight%}

##Python

###Repeat a string
{%highlight python%}
'this is a string' * 100
{%endhighlight%}

###Sort a list `nums` and return index
{%highlight python%}
>>> nums=[1,2,3,4,2,2,1,2,3,2,1,2,3,4,5]
>>> ind = sorted(range(len(nums)), key = lambda x: nums[x])
{%endhighlight%}

###Iterate over a list with index and value
{%highlight Python%}
for i,v in enumerate(mylist):
  print i,v
{%endhighlight%}

###Pair up value in lists
{%highlight Python%}
for v1,v2 in zip(None,v1List,v2List):
  print v1,v2
{%endhighlight%}

###Product of lists
{%highlight Python%}
import itertools
for v1,v2 in list(itertools.product(v1List,v2List))
  print v1,v2 
{%endhighlight%}

