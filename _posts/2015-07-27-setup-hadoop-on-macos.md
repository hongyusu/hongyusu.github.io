---
layout: post
title: "Setup Hadoop on Macos"
description: ""
category: Programming
tags: [Programming, Hadoop, bigdata, Macos]
---
{% include JB/setup %}


# Table of content
* auto-gen TOC:
{:toc}

# Hadoop installation

In particular, Hadoop will run in a standalone mode. The installation will allow full functionalities for coding practice although it does not provide cluster performance.

## Download Hadoop on Macos

1. Install `brew` with the following command

   `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

1. Install `java` with the following command

   `brew install Caskroom/cask/java`

1. Install `hadoop` witht the following command

   `brew install hadoop`

   Hadoop is the located in the directory ` /usr/local/Cellar/hadoop/2.7.1/` in which my current verion number is 2.7.1

## Hadoop configuration

For Hadoop configuration, we need to modify the following files in the Macos system

- `/usr/local/Cellar/hadoop/2.7.1/libexec/etc/hadoop/hadoop-env.sh`
- `/usr/local/Cellar/hadoop/2.7.1/libexec/etc/hadoop/Core-site.xml`
- `/usr/local/Cellar/hadoop/2.7.1/libexec/etc/hadoop/mapred-site.xml`
- `/usr/local/Cellar/hadoop/2.7.1/libexec/etc/hadoop/hdfs-site.xml`
- `~/.profile`

1. Modify `/usr/local/Cellar/hadoop/2.7.1/libexec/etc/hadoop/hadoop-env.sh`
   1. Find the following line from the file

      	export HADOOP_OPTS="$HADOOP_OPTS -Djava.net.preferIPv4Stack=true"

   1. Change it into 

      	export HADOOP_OPTS="$HADOOP_OPTS -Djava.net.preferIPv4Stack=true -Djava.security.krb5.realm= -Djava.security.krb5.kdc="

1. Modify `/usr/local/Cellar/hadoop/2.7.1/libexec/etc/hadoop/Core-site.xml`
   1. Find the block for configuration

      	<configuration>
      	</configuration>

   1. Replace with the following content

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

1. Modify `/usr/local/Cellar/hadoop/2.7.1/libexec/etc/hadoop/mapred-site.xml`
   1. Find the block for configuration in the file

      	<configuration>
      	</configuration>

   1. Replace it with following block

      	<configuration>
      		<property>
      			<name>mapred.job.tracker</name>
      			<value>localhost:9010</value>
      		</property>
      	</configuration>

1. Modify `/usr/local/Cellar/hadoop/2.7.1/libexec/etc/hadoop/hdfs-site.xml`
   1. Find the block for configuration in the file

      	<configuration>
      	</configuration>

   1. Replace it with following block

      	<configuration>
      		<property>
      			<name>dfs.replication</name>
      			<value>1</value>
      		</property>
      	</configuration>

1. Modify `~/.profile`
   1. Add alias in `~/.profile`

      `alias hstart="/usr/local/Cellar/hadoop/2.7.1/sbin/start-dfs.sh;`
      `/usr/local/Cellar/hadoop/2.7.1/sbin/start-yarn.sh"`
      `alias hstop="/usr/local/Cellar/hadoop/2.7.1/sbin/stop-yarn.sh;`
      `/usr/local/Cellar/hadoop/2.7.1/sbin/stop-dfs.sh"`

   1. Update the file with the following command

      `source ~/.profile`

## System configuration

1. Format the Hadoop file system with `hdfs namenode -format`.
1. Enable the functionality of remote login from `system preference->sharing->remove login`.

## Start Hadoop

1. Start Hadoop with the command `hstart`.
1. Stop Hadoop with the command `hstop`.
1. Generate SSH key to allow pass-free local access.
1. The running status of Hadoop can be checked by browsing the following address
   1. Resource Manager: http://localhost:50070
   1. JobTracker: http://localhost:8088
   1. Specific Node Information: http://localhost:8042






 
