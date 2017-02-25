---
layout: amt-post 
title: "Streaming processing (II): Best Spark Practice"
location: Helsinki
tags: [Streaming]
---

In the previous article, I briefly discussed the basic setup and integration of Spark Streaming, Kafka, Confluent Schema Registry, and Avro for streaming data processing. My focus here is to demonstrate the best practices when it comes to applying these streaming processing technologies. In particular, I will illustrate a few common Spark Streaming operations (e.g., **transform**, **Broadcast**), serialization and deserialization, and unit test for Spark streaming processing. 

# Table of content
* auto-gen TOC:
{:toc}

# Related articles

1. [Streaming processing (III): Best Spark Practice](/amt/streaming-processing-iii.html)
1. [Streaming processing (II):  Best Kafka Practice](/amt/streaming-processing-ii.html)
1. [Streaming processing (I):   Kafka, Spark, Avro Integration](/amt/spark-streaming-kafka-avro-and-registry.html)

# Package and versions

1. The following packages need to be prepared.

   | Packages           | Version  | Repository                                 |
   |:------------------:|:---------|:-------------------------------------------|
   | mvn                | 3.3.9    |                                            | 
   | gradle             | 3.3      |                                            |
   | kafka              | 0.10.1.0 | git@github.com:hongyusu/kafka.git          |
   | schemaregistry     | 3.1.2    | git@github.com:hongyusu/schema-registry    |
   | flume              | 1.8.0    | git@github.com:hongyusu/flume.git          |


1. They can be compiled and built via

   maven
   
   ```shell
   mvn package -Dmaven.test.skip=true
   ```
   
   or gradle 
   
   ```shell
   gradle build -x test
   ```


# Spark Stream

## Implementation

## Unit test


# Conclusion


    

[kafkapackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_kafka
[kafkabuild]:   https://github.com/hongyusu/bigdata_etl/blob/master/etl_kafka/build.gradle
[kafkamain]:    https://github.com/hongyusu/bigdata_etl/blob/master/etl_kafka/src/main/java/etl_kafka/KafkaETLMain.java
[sparkpackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_spark
[sparkbuild]:   https://github.com/hongyusu/bigdata_etl/blob/master/etl_spark/build.gradle




