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


##Install Jekyll-Bootstrap and template

I install [Jekyll-Bootstrap](http://jekyllbootstrap.com) with the following command

{% highlight c++ %}
git clone git@github.com:plusjade/jekyll-bootstrap.git hongyusu.github.io
{% endhighlight %}

There is a [GitHub tutorial](https://pages.github.com) for building personal website.
Follow the instruction and build a place holder in GitHub.
Then config another remote name which points to my GitHub folder and commit the content to my GitHub

{% highlight c++ %}
git remove add origin-hongyusu git@github.com:hongyusu/hongyusu.github.io.git
git add -A
git commit -m'first commit' .
git push -u origin-hongyusu master
{% endhighlight %}


The website can be accessed from `hongyuu.github.io`.
To make it fancier, I will _borrow_ the [UI theme](http://themes.jekyllbootstrap.com) for [Jekyll-Bootstrap](http://jekyllbootstrap.com).
In particular, my website is based on the [Mark-Reid theme](http://themes.jekyllbootstrap.com/preview/mark-reid/) which can be added to the Jekyll website by running following command in the website folder

{% highlight c++ %}
rake theme:install git="git://github.com/jekyllbootstrap/theme-mark-reid.git"
{% endhighlight %}

I saw someone is using [_twitter_ theme](http://themes.jekyllbootstrap.com/preview/twitter/).
However, it does not work well with me because of the following reasons

   - I have to fix few bugs to make 'supporting tagline' work.
   - This theme does not work well with syntax highlights.

Remember to add and commit new files to GitHub after installing the theme.

Yes, it is quite complicated to modify the website, update GitHub, and check the revision from `hongyusu.github.com`.
Instead, we can run the website locally by Jekyll.
Run the following command in the website folder

{% highlight c++ %}
jekyll server --watch
{% endhighlight %}

We can access the website locally by the following address `http://localhost:4000`.

## Configuration


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

it will appear as

{% highlight python %}
for i in range(10):
  i = i + 1
  print i
{% endhighlight %}

A piece of Java code

~~~
{% raw %}{% highlight java %}
var s = "JavaScript syntax highlighting";
alert(s);
{% endhighlight %}{% endraw %}
~~~

will appear as

{% highlight javascript %}
var s = "JavaScript syntax highlighting";
alert(s);
{% endhighlight %}


##Add support for Latex

The original Makedown language lacks the support of editing mathematics equation.
Meanwhile, mathematical notations and equations are crucial in data science to convert exact ideas.
To enable Latex in Jekyll, we modify the head of each individual page or the `default.html` by adding the following JaveScript

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

