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

# Packages

| Package | Version |
|:--------|:-------:|
| hive    | 2.1.0   |
| mariadb | 10.1.21 |
| sqoop   | 1.4.6   |
| flume   | 1.8.0   |


# Sqoop

1. Complete code can be found from my [Github:BigData:ETL:Sqoop][sqooppackage]

1. MySql

   - Install MariaDB according to the followings
   
     ```shell
     brew install mariadb
     mysql.server start
     ```
   
   - Create a test database **test** and a test table **testtable**, insert a couple of lines.
   
   - Download driver class, in this case, jdbd driver *mysql-connector-java-5.1.41-bin.jar*. Copy the jar file to sqoop */lib/*.
   
   - MySql to file ingestion, the following command will import the whole table from mySql to hdfs.
   
     ```shell
     sqoop import \
         --connect jdbc:mysql://localhost/test \
         --username root \
         --P \
         --table testtable \
         --target-dir ./testtable_table \
         -m 1
     ``` 
   
   - MySql to file ingestion, importing by running SQL query inside Sqoop is quite often a more flexible way.
   
     ```shell
     sqoop import \
         --connect jdbc:mysql://localhost/test \
         --username root \
         --P \
         --query "select * from testtable where \$CONDITIONS" \
         --target-dir ./testtable_query \
         -m 1
     ```

1. Hive

   - Install and setup Hive, in which one needs to download and install Hive, configures metastore in mySql, setup hdfs folder structure.

   - Create a hive table and import data from a CSV file. HQL script can be found from [Github:BigDataETL:Hive][hivepackage].

     ```hql
     -- drop table 
     drop table if exists ratings;
     
     -- create table
     create table ratings (
         userID int,
         movieID int,
         rating int,
         ts int)
         row format delimited
         fields terminated by ','
         stored as textfile;
     
     -- load data from file
     load data local inpath './ml-latest-small/ratings.csv' overwrite into table ratings;
     ```  

   - MySql to Hive ingestion, the following command will import a mySql table defined in the previous section into a Hive table.

     ```shell
     sqoop import \
        --connect jdbc:mysql://localhost/test \
        --username root \
        --P \
        --table testtable \
        --hive-import \
        --hive-database test \
        --create-hive-table \
        --hive-table testtable \
        -m 1 
     ```

   - Hive to MySql ingestion, the following command will import a Hive table defined above into a mySql table for which table structure should be defined prior to the ingestion.

     ```shell
     sqoop export \
         --connect jdbc:mysql://localhost/test \
         --username root \
         --password pwd \
         --table ratings \
         --export-dir /user/hive/warehouse/test.db/ratings \
         -m 1
     ```
   
   
# Flume 

1. Complete code can be found from my [Github:BigData:ETL:Flume][flumepackage]


# Conclusion

TBD

[flumepackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_flume
[sqooppackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_sqoop
[hivepackage]:  https://github.com/hongyusu/bigdata_etl/tree/master/db_hive




