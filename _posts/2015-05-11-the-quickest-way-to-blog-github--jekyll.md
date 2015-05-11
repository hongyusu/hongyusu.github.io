---
layout: 		post
title: 			"The quickest way to blog, GitHub + Jekyll"
description:	""
category:		Programming
tags: [Introduction, Programming, Jekyll, GitHub]
---
{% include JB/setup %}

<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>


##Add support the syntax highlight

It would be great if my code can be highlighted by languages.
This is of course possible.
First, make sure there is a line of `highlighter: pygments` in `./_config.yml` file.
Then [Pygments](http://pygments.org) will do the trick.

For example, if we write the following piece of Python code 

~~~
{% raw %}{% highlight python %}
for i in range(10):
  i = i + 1
  print i
{% endhighlight %}{% endraw %}
~~~

It will appear as

{% highlight python %}
for i in range(10):
  i = i + 1
  print i
{% endhighlight %}


##Add support for Latex

The original Makedown language lacks the support of editing mathematics equation.
Meanwhile, mathematical notations and equations are crucial in data science to convert exact ideas.
To enable Latex in Jekyll, we modify the head of each individual page or the `default.html` by adding the following JaveScript

```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```

{% highlight javascript %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
{% endhighlight %}

As a results, for example, when we write down the following optimization problem of the Support Vector Machines

{% highlight latex %}
$$ \underset{\mathbf{w},\xi}{\min}\quad  \frac{1}{2}||\mathbf{w}||^2 + C\sum_{i=1}^{n}\xi_i\\\text{s.t.}\quad C\ge0, \xi_i\ge0, \forall i\in\{1,\cdots,n\}.$$
{% endhighlight %}

It will appear as

$$ \underset{\mathbf{w},\xi}{\min}\quad  \frac{1}{2}||\mathbf{w}||^2 + C\sum_{i=1}^{n}\xi_i\\\text{s.t.}\quad C\ge0, \xi_i\ge0, \forall i\in\{1,\cdots,n\}.$$

Although this approach is not very elegant and lacks of some environments (e.g., `\begin{align}...\end{align}`) compare to the original Latex, it is good enough to display good mathematics on a webpage. 
In fact the interpreter running behind the scene is a Javascript library known as [Mathjax](https://www.mathjax.org).
I should dig into it a bit more.






---

