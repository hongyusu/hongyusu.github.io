---
layout: post
title: "Spark running on Amazon EC2"
description: ""
category: Technology
tags: [Spark, EC2, Amazon]
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 



![photo1]({{ site.url }}/myimages/ss_20160112_0.jpg)



# Table of content
* auto-gen TOC:
{:toc}


# Setup Spark on Amazon EC2

1. First off, you need an account -- get an Amazon Web Service (AWS) account from [Amazon AWS and EC2](https://aws.amazon.com/ec2/).

1. The next thing is to generate a paired key which will later allow SSH connection to Amazon server without strict authentication. You will be fine on this with the following steps.

   1. Go to Amazon console interface and choose from the top-right corner the location of the server. It should be as close to your real geographical location as possible.
   1. There are some choices which you are free to choose from. In my case, I was automatically assigned to a west US server. The list of servers are shown in the following table.
    
    |Server code | Geographical area|
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

   1. I would like to work with some cluster which is near Helsinki. There is one located in Frankfurt. However the Frankfurt server does not work well in my case. As an alternative I will be using the cluster server located in Dublin. It turns out that the server in Dublin is much more responsive than the one in west US.
   1. After selecting the cluster server located in Dublin, I continue to generate a paired key by pressing the button on the bottom left corner of the web console.
   1. Name the key file (I use `SparkEC2Key` as the file name), and it will then automatically download and saved to your local computer.
   1. Now I have the key file, the access permission of the downloaded key file needs to be changed by the command `chmod 400 SparkEC2Key.pem`

1. Now everything is somehow sorted. Then we have to initialize and launch a cluster on Amazon EC2.

1. I would assume that you have downloaded the latest Spark package to your local computer. Navigate to the `ec2/` directory which is just under the Spark home directory.

1. Two system environment variables also need to be set before launching Spark on Amazon EC2. They are generated based on your credentials on the Amazon services and they should be set by the following command. Again in my case
   `export AWS_SECRET_ACCESS_KEY=GMjZTHJdywDKp52dHdEs91zEpfhka/y8Fi2VkJE9`
   `export AWS_ACCESS_KEY_ID=AKIAJM23WTPOCUOHQ2XA`

1. Launch an EC2 Spark cluster with the following command which will initialize a cluster with 10 slaves and 1 master. This command will take a few minutes. After some log messages, you should be able to see that the cluster being successfully initialized and running. 
   `./spark-ec2 --key-pair=SparkEC2Key --identity-file=SparkEC2Key.pem --region=eu-west-1 --worker-instances=10 --instance-type=t2.micro launch EC2_1`

   **Make sure you attach the argument `--instance-type=t2.micro`, otherwise you will login to the m1.large machine. The most expensive one and you definitely don't want to pay!**

1. You can also get the HTTP address of the web monitor of the launched cluster. Pay attention that `EC2_1` is the name of your cluster and `--identity-file` is the paired key file which is just downloaded.

1. Open a web browser, go to the web monitor following the HTTP address, and check the status of the EC2 cluster. Again, in my case the address looks like `http://ec2-54-186-122-87.us-west-2.compute.amazonaws.com:8080`. From this browser of the master node, you will see a lot of information e.g., how many slaves have been created.

1. Login to the created cluster with the following command. After login, you will find out that Spark is preinstalled in your directory.

   `./spark-ec2 --key-pair=SparkEC2Key --identity-file=SparkEC2Key.pem --region=eu-west-1 login EC2_1`

1. Stop the Spark EC2 cluster with the following command

   `./spark-ec2 --key-pair=SparkEC2Key --identity-file=SparkEC2Key.pem --region=eu-west-1 stop EC2_1`

1. Again start the Spark EC2 cluster with the following command

   `./spark-ec2 --key-pair=SparkEC2Key --identity-file=SparkEC2Key.pem --region=eu-west-1 start EC2_1`

1. After the cluster is stopped it can be terminated with following command

   `./spark-ec2 --key-pair=SparkEC2Key --identity-file=SparkEC2Key.pem --region=eu-west-1 destroy EC2_1`


# External sources

- ['Big data mini course'](http://ampcamp.berkeley.edu/big-data-mini-course/index.html) is an introductory course about running Spark  on Amazon EC2.



