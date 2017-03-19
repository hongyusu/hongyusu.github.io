---
layout: amt-post 
title: "BigData searching (I): Apache Solr"
location: Helsinki
tags: [Streaming]
---

TBD WIP.

# Related articles

1. [BigData searching (II): Elasticsearch, Logstash, Kibana](/amt/)
1. [BigData searching (I): Apache Solr](/amt/)

# Table of content
* auto-gen TOC:
{:toc}

# Package and versions

The following packages are required.

| Packages           | Version  | Repository                                 |
|:-------------------|---------:|-------------------------------------------:|
| mvn                | 3.3.9    |                                            | 
| gradle             | 3.3      |                                            |
| storm              | 1.0.3    | git@github.com:hongyusu/storm.git          |


# Storm build and installation

1. Download the source code of *storm* from [repo](git@github.com:hongyusu/storm.git), enter the source directory, and build the code with *maven* 

   ```shell
   mvn clean install -DskipTests=true
   cd storm-dist/binary/
   mvn package -Dgpg.skip -Dtest.skip
   ```

1. Find the release package and unpack the tar ball 

   ```shell
   cd target
   tar xvvf apache-storm-1.0.3.tar.gz
   ```

1. Run from the *bin/* folder inside the release package and you are ready to go.

# Conclusion


[stormnativeapi]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_spark/src/main/etl_storm/WordCountTopology.java
[stormtridentapi]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_spark/src/main/etl_storm/TridentKafkaWordCount.java



