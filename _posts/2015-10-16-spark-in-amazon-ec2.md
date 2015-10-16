---
layout: post
title: "Spark in Amazon EC2"
description: ""
category: Programming
tags: [Spark, EC2, Amazon]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
# Table of content
* auto-gen TOC:
{:toc}

# 

## 

- Get an Amazon AWS account


- Launch an EC2 Spark cluster with the following command

{% highlight Bash linenos %}
./spark-ec2 --key-pair=key1 --identity-file=key1.pem --region=us-west-2 --zone=us-west-2a launch EC2_1
{% endhighlight%}

  This might take a few minutes. After lots of log information, you will be notified that the cluster is initialized. You can also get the HTML address of the web monitor of the cluster.

- Open a browser, go to the web monitor, and check the status of the EC2 cluster. In my case the address is `http://ec2-54-186-122-87.us-west-2.compute.amazonaws.com:8080`.

- Login to the created cluster with the following command

{% highlight Bash linenos %}
./spark-ec2 --key-pair=key1 --identity-file=key1.pem --region=us-west-2 --zone=us-west-2a login EC2_1
{% endhighlight%}
