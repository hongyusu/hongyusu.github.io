---
layout: post
title: "Build a web app on Amazon"
description: ""
category: Technology
tags: [Amazon, DeepLearning, WebApp]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>


![photo1]({{ site.url }}/myimages/ss_20160112_0.jpg)



# Table of content
* auto-gen TOC:
{:toc}


# Main

coming soon :laughing:

1. Set-up environment variable

   ```
   # Change to your own unique S3 bucket name:
   source_bucket=alestic-lambda-example

   # Do not change this. Walkthrough code assumes this name
   target_bucket=${source_bucket}resized

   function=CreateThumbnail
   lambda_execution_role_name=lambda-$function-execution
   lambda_execution_access_policy_name=lambda-$function-execution-access
   lambda_invocation_role_name=lambda-$function-invocation
   lambda_invocation_access_policy_name=lambda-$function-invocation-access
   log_group_name=/aws/lambda/$function
   ```



# Extra reading materials

There are always very good external reading materials available on the web. 

1. For example, this article ['A beginner's guide to Amazon S3 and web hosting'](http://www.smalldatajournalism.com/projects/one-offs/using-amazon-s3/) is a part of the website which is built for a practical course 'Small data journalism'. It offers very good introductory knowledge on hosting a website with Amazon services.
1. In addition, you can reed this article ['How to serve 100k users without breaking server'](http://blogging.alastair.is/how-i-served-100k-users-without-crashing-and-only-spent-0-32/) for more practical details on building a website with Amazon S3.
1. Still, ['Getting started with AWS and Python'](http://aws.amazon.com/articles/Amazon-EC2/3998) offers a excellent running example :question: of running an small web application on Amazon using S3, EC2, and SQS.
1. And maybe ['Setting up EC2 and Django'](http://markhops.blogspot.fi/2012/05/how-to-setting-up-ec2-and-django.html) is also useful for our purpose.
1. Also [Hosting a web app on Amazon web service](http://docs.aws.amazon.com/gettingstarted/latest/wah-linux/web-app-hosting-intro.html).











