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
 
# Table of content
* auto-gen TOC:
{:toc}

# Deploy ELK stack on Amazon AWS

### Setup Amazon AWS

1. Login Amazon AWS with your own creditial via SSH

   ```bash
      ssh -i "hongyusuireland.pem" ubuntu@ec2-54-194-211-18.eu-west-1.compute.amazonaws.com
   ```

### Elasticsearch

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
   You should expect the following message after running the above command
   ```
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


### Logstash

### Kibana

### Fix access rules

### Runing example

# External reading