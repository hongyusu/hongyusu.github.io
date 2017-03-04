---
layout: amt-post 
title: "Data ingestion and loading: Flume, Sqoop, Hive, and HBase"
location: Helsinki
tags: [Ingestion]
---


In this article, we will focus on data ingestion in particular from/to HDFS, Hbase, MySQL, Hive via Sqoop and Flume. As a bonus, we will discuss on the installation and configuration of Hadoop, Hbase, Hive, Sqoop on OsX.


# Table of content
* auto-gen TOC:
{:toc}

# Package and version

| Package | Version |
|:--------|:-------:|
| hadoop  | 2.7.3   |
| hive    | 2.1.0   |
| mariadb | 10.1.21 |
| sqoop   | 1.4.6   |
| flume   | 1.8.0   |


# Installation and setup

## Hadoop

1. Install *Hadoop*

   ```shell
   ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   brew install hadoop
   ```

1. Configure *Hadoop*

   Locate file `/usr/local/Cellar/hadoop/2.7.3/libexec/etc/hadoop/hadoop-env.sh` and change or update the following line

   ```shell
   export HADOOP_OPTS="$HADOOP_OPTS -Djava.net.preferIPv4Stack=true -Djava.security.krb5.realm= -Djava.security.krb5.kdc="
   ```

   Locate file `/usr/local/Cellar/hadoop/2.7.3/libexec/etc/hadoop/core-site.xml` and change or update the following line

   ```xml
   <configuration>
       <property>
           <name>hadoop.tmp.dir</name>
           <value>/usr/local/Cellar/hadoop/hdfs/tmp</value>
           <description>A base for other temporary directories.</description>
       </property>
       <property>
           <name>fs.default.name</name>
           <value>hdfs://localhost:9000</value>
       </property>
   </configuration>
   ```

   Locate file `/usr/local/Cellar/hadoop/2.7.3/libexec/etc/hadoop/mapred-site.xml` and change or update the following line

   ```xml
   <configuration>
   <property>
       <name>mapred.job.tracker</name>
       <value>localhost:9010</value>
   </property>
   </configuration>
   ```

   Locate file `/usr/local/Cellar/hadoop/2.7.3/libexec/etc/hadoop/hdfs-site.xml` and change or update the following line

   ```xml
   <configuration>
   <property>
       <name>mapred.job.tracker</name>
       <value>localhost:9010</value>
   </property>
   </configuration>
   ```

   For convenient, add the following two line to `~/.profile` and load with `source ~/.profile`

   ```shell
   export HADOOP_HOME=/usr/local/Cellar/hadoop/2.7.3
   export HIVE_HOME=/usr/local/Cellar/hive/2.1.0/libexec
   alias hstart="/usr/local/Cellar/hadoop/2.7.3/sbin/start-dfs.sh;/usr/local/Cellar/hadoop/2.7.3/sbin/start-yarn.sh"
   alias hstop="/usr/local/Cellar/hadoop/2.7.3/sbin/stop-yarn.sh;/usr/local/Cellar/hadoop/2.7.3/sbin/stop-dfs.sh"
   export PATH=/usr/local/Cellar/hive/2.1.0/bin/:$PATH
   ```

1. Check and fix SSH connection
 
   Check SSh connection to localhost with following command
 
   ```shell
   cat ~/.ssh/id_res.pub >> ~/.ssh/authorized_keys
   ssh localhost
   ```
  
   In case of port 22 not open for ssh, fix with the following command

   ```shell
   sudo systemsetup -setremotelogin on
   ```

 1. Format *hdfs* with `hdfs namenode -format` and start *Hadoop* with `hstart`

## MySql

Install MariaDB according to the followings

```shell
brew install mariadb
mysql.server start
```

## Hive

1.  Install *Hive* from *home brew* 

   ```shell
   brew install mysql
   brew install hive
   ```

1.  Download driver class, in this case, jdbd driver *mysql-connector-java-5.1.41-bin.jar*. Copy the jar file to *Hive* lib.

1.  Set Hive metastore on MySql, first run shell command and get into MySql

   ```shell
   mysqladmin - u root password 'pwd'
   mysql - u root - p
   ```

   then run the following SQL

   ```shell
   CREATE DATABASE metastore;
   USE metastore;
   ALTER DATABASE metastore CHARACTER SET latin1 COLLATE latin1_swedish_ci;
   CREATE USER 'hiveuser'@'localhost' IDENTIFIED BY 'hivepwd';
   GRANT ALL PRIVILEGES ON *.* TO 'hiveuser'@'localhost' WITH GRANT OPTION;
   ```

1.  Configure Hive

   ```xml
   <property>
      <name>javax.jdo.option.ConnectionURL</name>
      <value>jdbc:mysql://localhost/metastore</value>
   </property>
   <property>
       <name>javax.jdo.option.ConnectionDriverName</name>
       <value>com.mysql.jdbc.Driver</value>
   </property>
   <property>
      <name>javax.jdo.option.ConnectionUserName</name>
      <value>hiveuser</value>
   </property>
   <property>
      <name>javax.jdo.option.ConnectionPassword</name>
      <value>hivepwd</value>
   </property>
   <property>
      <name>datanucleus.fixedDatastore</name>
      <value>false</value>
   </property>
   <property>
      <name>hive.exec.local.scratchdir</name>
      <value>/tmp/hive</value>
   <description>Local scratch space for Hive jobs</description>
   </property>
   <property>
      <name>hive.downloaded.resources.dir</name>
      <value>/tmp/hive</value>
   <description>Temporary local directory for added resources in the remote file system.</description>
   </property>
   <property>
      <name>hive.querylog.location</name>
      <value>/tmp/hive</value>
   <description>Location of Hive run time structured log file</description>
   </property>
   ```

1.  Run Hive schema tool for initialization

   ```shell
   schematool -initSchema -dbType mysql
   ```

1.  Initial Hive folder structure and assign proper permission

   ```shell
   hdfs dfs -mkdir -p /user/hive/warehouse
   hdfs dfs -chmod g+w /tmp
   hdfs dfs -chmod g+w /user/hive/warehouse
   ```

1.  Start Hive with `hive`. 


## Hbase

1. Install *hbase* from home brew

   ```shell
   brew install hbase
   export PATH=/usr/local/Cellar/hbase/1.2.2/bin/:$PATH
   alias hshell="hbase shell"
   ```

1. Edit the file `/usr/local/Cellar/hbase/1.2.2/libexec/conf/hbase-site.xml` by adding the following property.

   ```xml
   <configuration>
   <property>
       <name>hbase.rootdir</name>
       <value>hdfs://localhost:9000/hbase</value>
   </property>
   </configuration>
   ``` 

1. Start Hbase server `start-hbase.sh` and access via shell `hbase shell`.

1. create a namespace and an empty table `create_namespace test; create "test:testtable","field1"`.

# Sqoop

1. Complete code can be found from my [Github:BigData:ETL:Sqoop][sqooppackage]

1. MySql

   - Download driver class, in this case, jdbd driver *mysql-connector-java-5.1.41-bin.jar*. Copy the jar file to sqoop */lib/*.
   
   - Create a test database **test** and a test table **testtable**, insert a couple of lines.
   
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
   
1. Hbase

   - MySql to Hbase ingestion, the following command will import a mySql table defined above into a Hbase table.

     ```shell
     sqoop import \
         --bindir ./ \
         --connect jdbc:mysql://localhost/test \
         --username root \
         --password pwd \
         --table testtable  \
         --columns "column1, column2"  \
         --hbase-table testtable  \
         --column-family f1  \
         --hbase-row-key column1 \
         -m 1 -verbose
     ``` 
   
# Flume 

1. Complete code can be found from my [Github:BigData:ETL:Flume][flumepackage]


# Conclusion

TBD

[flumepackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_flume
[sqooppackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_sqoop
[hivepackage]:  https://github.com/hongyusu/bigdata_etl/tree/master/db_hive




