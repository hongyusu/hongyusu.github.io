---
layout: amt-post 
title: "Data ingestion: Flume and Sqoop"
location: Helsinki
tags: [Ingestion]
---

To discuss data ingestion, sqoop and flume.

# Table of content
* auto-gen TOC:
{:toc}

# Sqoop

1. Complete code can be found from my [Github:BigData:ETL:Sqoop][sqooppackage]

1. Install MariaDB according to the followings

   ```shell
   brew install mariadb
   mysql.server start
   ```

1. Create a test database **test** and a test table **testtable**, insert a couple of lines.

1. Download driver class, in this case, jdbd driver *mysql-connector-java-5.1.41-bin.jar*. Copy the jar file to sqoop */lib/*.

1. The following command will import the whole table from mysql to hdfs.

   ```shell
   sqoop import \
       --connect jdbc:mysql://localhost/test \
       --username root \
       --P \
       --table testtable \
       --target-dir ./testtable_table \
       -m 1
   ``` 

1. Importing by running SQL query inside Sqoop is quite often a more flexible way.

   ```shell
   sqoop import \
       --connect jdbc:mysql://localhost/test \
       --username root \
       --P \
       --query "select * from testtable where \$CONDITIONS" \
       --target-dir ./testtable_query \
       -m 1
   ```
   
# Flume 

1. Complete code can be found from my [Github:BigData:ETL:Flume][flumepackage]

[flumepackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_flume
[sqooppackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_sqoop




