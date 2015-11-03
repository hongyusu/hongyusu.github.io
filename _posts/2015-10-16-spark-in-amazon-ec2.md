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


# Setting up Spark on Amazon EC2

- Get an Amazon AWS account from Amazon [AWS and EC2](https://aws.amazon.com/ec2/).

- The next thing is to generate a paired key which will allow SSH connection to Amazon server automatically.

  - First I have to web console interface of Amazon and choose from the top right corner which server I will be using.
  - There will be a few choices and I was assigned to a west US server by default. But here is a list of servers available shown in the following table.
    
    |Code | Name|
    |:---|---:|
    |ap-northeast-1 | Asia Pacific (Tokyo)
    |ap-southeast-1 | Asia Pacific (Singapore)
    |ap-southeast-2 | Asia Pacific (Sydney)
    |eu-central-1 | EU (Frankfurt)
    |eu-west-1 | EU (Ireland)
    |sa-east-1 | South America (Sao Paulo)
    |us-east-1 | US East (N. Virginia)
    |us-west-1 | US West (N. California)
    |us-west-2 | US West (Oregon)

  - I would like to work with some cluster which is near Helsinki. However, the one in Frankfurt does not work in my case. Then I have to use the cluster from Dublin.
  - It turns out that the server in Dublin is much responsive than the one in west US. I am located in Helsinki.
  - After select the server in Dublin, I continue to generate a paired key by pressing the button on the bottom left corner of the web console.
  - Name the key file (I use `SparkEC2Key`), and it will then automatically download and save to your working computer.
  - Now I have the key file, the access permission of the file needs to be changed by the following command.
    {% highlight Bash linenos%}
    chmod 400 SparkEC2Key.pem
    {% endhighlight %}

- Now everything is more or less sorted. Then we have to somehow initialize/launch a cluster on Amazon EC2.

- I would assume that you have downloaded the latest Spark package to your local computer. Navigate to `ec2/` directory.

- Two system environment variable need to be set before launching Spark on Amazon EC2. They are related to your credentials on the Amazon services and they can be set by the following command. Again in my case

  {% highlight Bash linenos%}
  export AWS_SECRET_ACCESS_KEY=GMjZTHJdywDKp52dHdEs91zEpfhka/y8Fi2VkJE9
  export AWS_ACCESS_KEY_ID=AKIAJM23WTPOCUOHQ2XA
  {% endhighlight %}

- Launch an EC2 Spark cluster with the following command which will initialize a cluster with 10 slaves and 1 master.
- The command will take a few minutes. After many log messages, you will find out that the cluster is successfully initialized and running. 

  {% highlight Bash linenos %}
  ./spark-ec2 --key-pair=SparkEC2Key --identity-file=SparkEC2Key.pem --region=eu-west-1 --worker-instances=10 --instance-type=t2.micro launch EC2_1
  {% endhighlight%}

  **Make sure you have added the argument `--instance-type=t2.micro`, otherwise you will login to the m1.large machine. The most expensive one and you have to pay!**

- You can also get the HTTP address of the web monitor of the cluster. Pay attention that `EC2_1` is the name of your cluster and `--identity-file` is the paired key file which is just downloaded.

- Open a browser, go to the web monitor via the following HTTP address, and check the status of the EC2 cluster. Again, in my case the address is `http://ec2-54-186-122-87.us-west-2.compute.amazonaws.com:8080`. From this browser of the master node, you will see e.g., how many slaves have been created.

- Login to the created cluster with the following command. After login, you will see that Spark is preinstalled in your directory.

{% highlight Bash linenos %}
./spark-ec2 --key-pair=SparkEC2Key --identity-file=SparkEC2Key.pem --region=eu-west-1 login EC2_1
{% endhighlight%}

- Stop the Spark EC2 cluster with the following command

{% highlight Bash linenos %}
./spark-ec2 --key-pair=SparkEC2Key --identity-file=SparkEC2Key.pem --region=eu-west-1 stop EC2_1
{% endhighlight%}

- Again start the Spark EC2 cluster with the following command

{% highlight Bash linenos %}
./spark-ec2 --key-pair=SparkEC2Key --identity-file=SparkEC2Key.pem --region=eu-west-1 start EC2_1
{% endhighlight%}

- After the cluster is stopped it can be terminated with following command

{% highlight Bash linenos %}
./spark-ec2 --key-pair=SparkEC2Key --identity-file=SparkEC2Key.pem --region=eu-west-1 destroy EC2_1
{% endhighlight%}


# External sources

- ['Big data mini course'](http://ampcamp.berkeley.edu/big-data-mini-course/index.html) is about running Spark on Amazon EC2.