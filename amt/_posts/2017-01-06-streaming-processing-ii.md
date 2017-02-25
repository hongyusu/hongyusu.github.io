---
layout: amt-post 
title: "Streaming processing with Spark Streaming, Kafka, Avro, etc (II): Best Practice"
location: Helsinki
tags: [Streaming]
---

Intro

# Table of content
* auto-gen TOC:
{:toc}

# Architecture

1. mvn
   1. v3.3.9 
1. gradle
   1. v3.3
1. kafka
   1. git@github.com:hongyusu/kafka.git
   1. v0.10.1.0
   1. gradle build -x test
1. schemaregistry
   1. git@github.com:hongyusu/schema-registry
   1. v3.1.2
   1. mvn package -Dmaven.test.skip=true
1. kafka-connect-jdbc
   1. git@github.com:hongyusu/kafka-connect-jdbc
   1. v3.1.2
   1. mvn package -Dmaven.test.skip=true
1. flume
   1. git@github.com:hongyusu/flume.git
   1. v1.8.0
   1. mvn package -Dmaven.test.skip=true


# Kafka

# Implement function 

# Unit test

# Spark

# Implement function 

# Unit test



# Conclusion


    





