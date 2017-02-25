---
layout: amt-post 
title: "Streaming processing with Spark Streaming, Kafka, Avro (II): Best Practice"
location: Helsinki
tags: [Streaming]
---

In the previous article, I briefly discussed the basic setup and integration of Spark Streaming, Kafka, Confluent Schema Registry, and Avro for streaming data processing. My focus here is to domonstrate the best practices when it comes to applying these streaming processing technologies. In particular, I will illustrate Kafka KStream processings (e.g., mapper, reducer, joiner), Spark Streaming processing (e.g. tranformation), serialization and deserialization in Kafka KStream and Spark Stream, and unit test for Kafka and Spark streaming operations.

# Table of content
* auto-gen TOC:
{:toc}

# Related articles

1. [Streaming processing with Spark Streaming, Kafka, Avro (II): Best Practice](/amt/streaming-processing-ii.html)
2. [Streaming processing with Spark Streaming, Kafka, Avro (I): Integration](/amt/spark-streaming-kafka-avro-and-registry.html)

# Package and versions

1. The following packages need to be prepared.

   | Packages | Version | Repository |
   |:---:|:---|:---|
   | mvn                | 3.3.9    |                                            | 
   | gradle             | 3.3      |                                            |
   | kafka              | 0.10.1.0 | git@github.com:hongyusu/kafka.git          |
   | schemaregistry     | 3.1.2    | git@github.com:hongyusu/schema-registry    |
   | flume              | 1.8.0    | git@github.com:hongyusu/flume.git          |
   | kafka-connect-jdbc | 3.1.2    | git@github.com:hongyusu/kafka-connect-jdbc |


1. They can be compiled and built via

   maven
   
   ```shell
   mvn package -Dmaven.test.skip=true
   ```
   
   or gradle 
   
   ```shell
   gradle build -x test
   ```


# Kafka

## Implemetion
## Unit test 

# Spark

## Implemetion
## Unit test 

# Others

# Conclusion


    





