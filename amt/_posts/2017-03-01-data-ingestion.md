---
layout: amt-post 
title: "Data ingestion: Flume and Sqoop"
location: Helsinki
tags: [Streaming]
---


# Related articles


# Table of content
* auto-gen TOC:
{:toc}

# Package and versions

# Sqoop

1. Install MariaDB according to the followings

   ```shell
   brew install mariadb
   mysql.server start
   ```

1. Create a test database **test** and a test table **testtable**, insert a couple of lines.

1. Download driver class, in this case, jdbd driver *mysql-connector-java-5.1.41-bin.jar*. Copy the jar file to sqoop */lib/*.

1. 

   

[kafkapackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_kafka
[kafkabuild]:   https://github.com/hongyusu/bigdata_etl/blob/master/etl_kafka/build.gradle
[kafkamain]:    https://github.com/hongyusu/bigdata_etl/blob/master/etl_kafka/src/main/java/etl_kafka/KafkaETLMain.java
[sparkpackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_spark
[sparkbuild]:   https://github.com/hongyusu/bigdata_etl/blob/master/etl_spark/build.gradle




