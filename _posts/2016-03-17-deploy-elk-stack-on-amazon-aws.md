---
layout: post
title: "Deploy ELK stack on Amazon AWS"
description: ""
category: 
tags: []
---
{% include JB/setup %}
<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
 
 
![photo1]({{ site.url }}/myimages/ss_20160121_0.jpg)
 
# Table of content
* auto-gen TOC:
{:toc}

# Deploy ELK stack on Amazon AWS

## Setup Amazon AWS

1. Login Amazon AWS with your own creditial via SSH

   ```bash
      ssh -i "hongyusuireland.pem" ubuntu@ec2-54-194-211-18.eu-west-1.compute.amazonaws.com
   ```

## Elasticsearch

### Simple installation

1. Download the Elasticsearch package

   ```bash
	  wget https://download.elasticsearch.org/elasticsearch/release/org/elasticsearch/distribution/tar/elasticsearch/2.2.1/elasticsearch-2.2.1.tar.gz
	  tar -xvvf elasticsearch-2.2.1.tar.gz
   ```

1. Customize the name of the elasticsearch instance as well as the name of the cluster by modifying the configuration file in `elasticsearch-2.2.1/config/elasticsearch.yml`.

1. If everything runs as expected, you can read from HTTP server of elasticsearch via 

   ```bash
      curl -XGET 'http://localhost:9200'
   ```
   You should expect the following message after running the above command. Of course, the name of the elasticsearch instance should match the one you write in configuration file.

   ```bash
     {
	    "name" : "example_name",
	    "cluster_name" : "example_cluster",
	    "version" : {
	      "number" : "2.2.1",
	      "build_hash" : "d045fc29d1932bce18b2e65ab8b297fbf6cd41a1",
	      "build_timestamp" : "2016-03-09T09:38:54Z",
	      "build_snapshot" : false,
	      "lucene_version" : "5.4.1"
	    },
	    "tagline" : "You Know, for Search"
	  }
   ```
   
1. In addition, as we haven't done any mapping with Logstash yet, you should not be able to see any mapping by running the following command. So running
   
   ```bash
      curl -XGET 'http://localhost:9200/_mapping?pretty'
   ```
   
   will give you :laughing:
   
   ```bash
      {}
   ```
   
### Install as a system service

1. As a alternative, we can also run Elasticsearch as a system service with the following lines of commands

   ```bash
      wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
	  echo "deb http://packages.elastic.co/elasticsearch/2.2/debian stable main" | sudo tee -a /etc/apt/sources.list.d/elasticsearch-2.2.list
	  sudo apt-get update
	  sudo apt-get install elasticsearch
	  sudo service elasticsearch start
	  sudo service elasticsearch status
   ```

## Logstash

![](https://www.elastic.co/guide/en/logstash/current/static/images/basic_logstash_pipeline.png)

Logstash is a data collection engine with real time pipeline capability. It is able to unify data from different sources. It does data cleaness and democratization and eventually pipes data into downstream analytics. Logstash works with Elasticsearch and Kibana, and handles all kinds of logging data (e.g., system logs, web logs, IoT logs, databases, and Kafka) as well as event streaming data. With [Grok](https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html) you are able to derive structured data out from unstructured data and with all kinds of plugins you are able to parse data of different format.

Yup, you should continue with the [documentation of logstash](https://www.elastic.co/guide/en/logstash/current/index.html). But you can also dive much faster with the following steps.

### Simple installation

1. Download the Elasticsearch package

   ```bash
	  wget https://download.elastic.co/logstash/logstash/logstash-2.2.2.tar.gz
	  tar -xvvf logstash-2.2.2.tar.gz
   ```

1. Well, now we should have a data file to parse with logstash. This should be a log file originally, but essentially, you can utilize the searching power on any file of similar format. The next thing is to config Logstash with a configuration file in while we will be writing the parsing pattern.

1. Run logstash with configuration file

   ```bash
      ./logstash-2.2.2/bin/logstash agent -f ~/elk_data/logstash.conf
   ```
   
1. Still, if everything runs as expected, with the following commands you can read the mapping status of logstash from elasticsearch HTTP server

   ```bash 
      curl -XGET 'http://localhost:9200/_mapping?pretty'
   ```


### Install as a system service

1. As a alternative, of course, you can also deploy Logstash as a system service, via the following lines of commands

   ```bash
	  echo "deb http://packages.elasticsearch.org/logstash/2.2/debian stable main" | sudo tee -a /etc/apt/sources.list
	  sudo apt-get update
	  sudo apt-get install logstash
	  sudo update-rc.d logstash defaults 97 8
   ```
   
   You can then start the service and check the status with the following commands. Yep, I guess stopping the service is very straight forward thing to do :laughing:
		
   ```bash
	  sudo service logstash start
	  sudo service logstash status
   ```


## Kibana

## Fix access rules

## Runing example

# External reading