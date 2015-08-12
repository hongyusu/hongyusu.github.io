---
layout: post
title: "Get Emoji support for Jekyll pages"
description: ""
category: Programming
tags: [Emoji, Programming, Jekyll, GitHub]
---
{% include JB/setup %}

1. This will allow you to use [Emoji](http://www.emoji-cheat-sheet.com) in your blog post.

1. First install `jemoji` for `jekyll` with the following command

   `sudo gem install jemoji`

1. Add the following to `_config.yml` in your `jekyll` website folder

   `gems: - jemoji`

1. And you are ready to go.

1. For example, you can generate a page like [this](http://hongyusu.github.io/2015/08/12/outstanding-doctoral-candidate-award-2014/).