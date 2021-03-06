---
layout: 		imt-post
title: 			"The quickest way to blog, GitHub + Jekyll"
description:	""
category:		Technology
tags: [Jekyll, GitHub]
---
The quickest way to blog, GitHub + Jekyll

##Install Jekyll-Bootstrap and template

I install [Jekyll-Bootstrap](http://jekyllbootstrap.com) with the following command

```c
git clone git@github.com:plusjade/jekyll-bootstrap.git hongyusu.github.io
```

There is a [GitHub tutorial](https://pages.github.com) for building personal website.
Follow the instruction and build a place holder in GitHub.
Then config another remote name which points to my GitHub folder and commit the content to my GitHub

```c
git remove add origin-hongyusu git@github.com:hongyusu/hongyusu.github.io.git
git add -A
git commit -m'first commit' .
git push -u origin-hongyusu master
```


The website can be accessed from `hongyuu.github.io`.
To make it fancier, I will _borrow_ the [UI theme](http://themes.jekyllbootstrap.com) for [Jekyll-Bootstrap](http://jekyllbootstrap.com).
In particular, this website is based on the [Hooligan Theme](http://themes.jekyllbootstrap.com/preview/hooligan/) which can be added to the Jekyll website by running following command in the website folder

```c
rake theme:install git="https://github.com/dhulihan/hooligan.git"
```

One of the good thing I can think of the Hooligan theme is that the syntax highlight of the programming code is very well displayed (see the following section).
I saw someone is using [_twitter_ theme](http://themes.jekyllbootstrap.com/preview/twitter/) or _mark-reid_ theme.
However, it does not work well with me because of the following reasons

   - For _twitter_ theme, I have to fix few bugs to make 'supporting tagline' work.
   - Also the _twitter_ theme does not work well with syntax highlights.
   - _mark-reid_ theme does not get along well with code block highlight. In particular, line change looks weird. 
 
Remember to add and commit new files to GitHub after installing the theme.

Yes, it is quite complicated to modify the website, update GitHub, and check the revision from `hongyusu.github.com`.
Instead, we can run the website locally by Jekyll.
Run the following command in the website folder

	```c
	jekyll server --watch
	```

In addition, I need lines to be number in my code. Therefore, I add the following two line in `syntax.css` file

```
.highlight .lineno { color: #ccc; display:inline-block; padding: 0 5px; border-right:1px solid #ccc; }
.highlight pre code { display: block; white-space: pre; overflow-x: auto; word-wrap: normal; }
```

We can access the website locally by the following address `http://localhost:4000`.

## Configuration

Next, I need to modify the `./_config.yml` file to e.g., change the name of the website template.

## Start to write things

Writing a new post can be initialized with the following Rake command

	```c
	rake post title="title of the post"
	```

The command will essentially generate a post page in `_posts/`.
The name of the post will follow the order of year, month, day, title.
Then I start to add content of the post by editing the file with my favourite editor `vim`. 
First, I add the meta information about this post e.g.,

```c
layout: post
title: "The quickest way to blog, GitHub + Jekyll"
description: ""
category: Programming
tags: [Introduction, Programming, Jekyll, GitHub]
```

Then I edit the content with [make down language](https://help.github.com/articles/markdown-basics/) or HTML.

After editing, the new content can be preview with the following Rake command

	{%highlight c++%}
	rake preview
	{%endhighlight%}

##Add support the syntax highlight

It would be great if my code can be highlighted by languages.
This is of course possible.
First, make sure there is a line of `highlighter: pygments` in `./_config.yml` file.
Then [Pygments](http://pygments.org) will do the trick.

For example, it I write down the following piece of Python code

~~~
{% raw %}```python
for i in range(10):
  i = i + 1
  print i
```{% endraw %}
~~~

it will appear as

```python
for i in range(10):
  i = i + 1
  print i
```

The following piece of Javascript code

~~~
{% raw %}```javascript
<!DOCTYPE html>
<html>
<body>
<h1>JavaScript Operators</h1>
<p>The + operator concatenates (adds) strings.</p>
<p id="demo"></p>
<script>
var txt1 = "What a very";
var txt2 = "nice day";
document.getElementById("demo").innerHTML = txt1 + txt2;
</script>
</body>
</html>
```{% endraw %}
~~~

will appear as

```javascript
<!DOCTYPE html>
<html>
<body>
<h1>JavaScript Operators</h1>
<p>The + operator concatenates (adds) strings.</p>
<p id="demo"></p>
<script>
var txt1 = "What a very";
var txt2 = "nice day";
document.getElementById("demo").innerHTML = txt1 + txt2;
</script>
</body>
</html>
```


##Add support for Latex

The original Makedown language lacks the support of editing mathematics equation.
Meanwhile, mathematical notations and equations are crucial in data science to convert exact ideas.
To enable Latex in Jekyll, we modify the head of each individual page or the `default.html` by adding the following JaveScript

	```javascript
	<script type="text/javascript"
	 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
	</script>
	```

As a results, for example, when we write down the following optimization problem of the Support Vector Machines

	```latex
	$$ \underset{\mathbf{w},\xi}{\min}\quad  \frac{1}{2}||\mathbf{w}||^2 + C\sum_{i=1}^{n}\xi_i\\\text{s.t.}\quad C\ge0, \xi_i\ge0, \forall i\in\{1,\cdots,n\}.$$
	```

it will appear as

$$ \underset{\mathbf{w},\xi}{\min}\quad  \frac{1}{2}||\mathbf{w}||^2 + C\sum_{i=1}^{n}\xi_i\\\text{s.t.}\quad C\ge0, \xi_i\ge0, \forall i\in\{1,\cdots,n\}.$$

Although this approach is not very elegant and lacks of some environments (e.g., `\begin{align}...\end{align}`) compare to the original Latex, it is good enough to display good mathematics on a webpage. 
In fact the interpreter running behind the scene is a Javascript library known as [Mathjax](https://www.mathjax.org).
I should dig into it a bit more.



