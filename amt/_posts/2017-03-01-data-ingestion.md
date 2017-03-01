---
layout: amt-post 
title: "Data ingestion: Flume and Sqoop"
location: Helsinki
tags: [Ingestion]
---


# Table of content
* auto-gen TOC:
{:toc}

# Sqoop

1. Install MariaDB according to the followings

   ```shell
   brew install mariadb
   mysql.server start
   ```

1. Create a test database **test** and a test table **testtable**, insert a couple of lines.

1. Download driver class, in this case, jdbd driver *mysql-connector-java-5.1.41-bin.jar*. Copy the jar file to sqoop */lib/*.


   

[flumepackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_flume
[sqooppackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_sqoop




