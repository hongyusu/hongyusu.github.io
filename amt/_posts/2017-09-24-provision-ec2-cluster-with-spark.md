---
layout: amt-post 
title: "Provision AWS EC2 cluster with Spark version 2.x"
location: Helsinki
tags: [Streaming]
---

This article is to provision a EC2 cluster with Spark and Hadoop. As a result, one should be able to run Spark applications utilizing HDFS file system. 

# Quick and dirty

For impatient reader, run the following script in a quick and dirty way. Remeber to replace access key and key pair with your own.

```bash
export AWS_SECRET_ACCESS_KEY=U/y3rO1/wwwzbyUe6wkzNwVG9Qb3uBdxBqiHsmcT
export AWS_ACCESS_KEY_ID=ABCAJKKNPJJRL74RPY4A
/Users/hongyusu/Codes/Packages/spark-ec2/spark-ec2 -k g1euwest -i g1euwest.pem \
        --region=eu-west-1 \
        --instance-type=t2.micro \
        -s 20 \
        --hadoop-major-version=2 \
        launch spark-cluster
```

# Setup the Spark cluster on EC2

1. Amazon AWS account

   Appearantly there needs to be an Amazon AWS account in order to use EC2 services. 

1. Access key 

   Access key allows application to communicate the EC2 servers

   1. From AWS front page, click your username on the topright corner, then choose my security credential, choose access key, click create access key. 

   1. Store the access key id and access key secret as a file. 

1. Key pair

   Key pair will essentially authenticate the applications/scripts with EC2 servers

   1. From front page, choose service EC2 on the top left corner, click key pairs, choose create key pair

   1. Name the key pair by following some pattern e.g. username+region so that key pairs from different regions will not get mixed 

   1. Download the file and save as .pem file

   1. change permission as user can read

      ```bash
      chmod 400 keypairfile.pem
      ```

1. export access key

   1. Export access key with the following command using key id and key string generated from previous step

      ```bash
      export AWS_SECRET_ACCESS_KEY=U/y3rO1/wwwzbyUe6wkzNwVG9Qb3uBdxBqiHsmcT
      export AWS_ACCESS_KEY_ID=ABCAJKKNPJJRL74RPY4A
      ```

1. Setup a Spark cluster using spark-ec2

   1. Spark-ec2 package is no longer part of Spark distribution. So we need to download spark-ec2 package from its [Github repository](https://github.com/amplab/spark-ec2).

   1. Setup a spark cluster via the following command. Name the cluster as _spark-cluster_.

      ```bash
      /Users/hongyusu/Codes/Packages/spark-ec2/spark-ec2 -k g1euwest -i g1euwest.pem \
      --region=eu-west-1 \
      --instance-type=t2.micro \
      -s 5 \
      --hadoop-major-version=2 \
      launch spark-cluster
      ```

      1. Describe key pair file via option _-i_

      1. Specify key name via option _-k_

      1. Give the number of Spark slave nodes via option _-s_ 

      1. Specify Hadoop version via option _--hadoop-major-version_

   1. Spark version could also be specified as additional options to spark-ec2. Unfortuntely I haven't figure out a good way to automatically build the Spark package on the master node. 

      ```bash
      --spark-version=a2c7b2133cfee7fa9abfaa2bfbfb637155466783 \
      --spark-git-repo=https://github.com/apache/spark \
      ```

# Other cluster operations

1. Login Spark cluster
   
   ```bash
   /Users/hongyusu/Codes/Packages/spark-ec2/spark-ec2 -k g1euwest -i g1euwest.pem --region=eu-west-1 login spark-cluster
   ```

1. Stop Spark cluster
   
   ```bash
   /Users/hongyusu/Codes/Packages/spark-ec2/spark-ec2 -k g1euwest -i g1euwest.pem --region=eu-west-1 stop spark-cluster
   ```

1. Restart Spark cluster
   
   ```bash
   /Users/hongyusu/Codes/Packages/spark-ec2/spark-ec2 -k g1euwest -i g1euwest.pem --region=eu-west-1 start spark-cluster
   ```

1. Destroy Spark cluster
   
   ```bash
   /Users/hongyusu/Codes/Packages/spark-ec2/spark-ec2 -k g1euwest -i g1euwest.pem --region=eu-west-1 destroy spark-cluster
   ```

1. UI

   - Spark UI is available from e.g. _http://ec2-54-246-255-51.eu-west-1.compute.amazonaws.com:8080_
   - Cluster UI is available from e.g. _http://ec2-54-246-255-51.eu-west-1.compute.amazonaws.com:5080/ganglia/_ 
   - After history server being started according to the next section, event history server is available from e.g. _http://ec2-54-246-255-51.eu-west-1.compute.amazonaws.com:18080_


# Some useful setting on Spark cluster

  1. Setup event history log
     
     1. Make a directory for event logs

        ```bash
        cd ~
        mkdir /tmp/spark-events
        ```

     1. Start Spark event history server and restart Spark engine
     
        ```bash
        cd ~/spark/sbin
        ./start-history-server.sh
        ./stop-all.sh ;./start-all.sh 
        ```

     1. Run a Spark application with event log enabled e.g. pySpark

        ```bash
        spark/bin/pyspark --conf "spark.eventLog.enabled=true" spark/examples/src/main/python/wordcount.py /data/data.txt
        ```

# Run Spark application on Spark cluster

Then I try to run a basic pySpark example on word count of Shakespears.

1. Login to master node of Spark cluster

   ```bash
   /Users/hongyusu/Codes/Packages/spark-ec2/spark-ec2 -k g1euwest -i g1euwest.pem --region=eu-west-1 login spark-cluster
   ```

   or 

   ```bash
   ssh -i "g1euwest.pem" root@ec2-54-246-255-51.eu-west-1.compute.amazonaws.com
   ```

1. Download data and preprocessing

   ```bash
   cd ~
   mkdir tmp; cd tmp
   wget https://ocw.mit.edu/ans7870/6/6.006/s08/lecturenotes/files/t8.shakespeare.txt  
   cat t8.shakespeare.txt | sed 's/ /\n/g' > data.txt
   ```

1. Move data to HDFS

   ```bash
   ephemeral-hdfs/bin/hadoop dfs -mkdir /data/
   ephemeral-hdfs/bin/hadoop dfs -put ~/tmp/data.txt /data/
   ```

1. Run pySpark word count example and activate event history logging.

   ```bash
   spark/bin/pyspark --conf "spark.eventLog.enabled=true" spark/examples/src/main/python/wordcount.py /data/data.txt
   ```
 
# Alternatives

  1. We could also look into [flintrock](https://github.com/nchammas/flintrock). I tried and it seems faster than [spark-ec2](https://github.com/amplab/spark-ec2)


