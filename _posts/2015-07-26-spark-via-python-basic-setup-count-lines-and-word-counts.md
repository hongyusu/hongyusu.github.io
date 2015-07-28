---
layout: post
title: "Spark via Python: basic setup, count lines, and word counts"
description: ""
category: Programming
tags: [Introduction, Programming, Spark, Python, BigData]
---
{% include JB/setup %}

This post is about how to set up Spark for Python. In particular, it shows the steps to setup Spark on an interactive cluster located in University of Helsinki, Finland. In addition, there are two super simple but classical problems: count lines in a files and word counts, together with the solution codes.

### Setup Spark services

1. Build a directory for the project

   `mkdir mySpark`

1. Download the latest Spark package from [Spark home](http://spark.apache.org/downloads.html). On Linux machine, use the following command

   `wget http://d3kbcqa49mib13.cloudfront.net/spark-1.4.1-bin-hadoop2.6.tgz`

1. Unpack the `.tar` package with the following command

   `tar -xvvf spark-1.4.1-bin-hadoop2.6.tgz `

1. Configure Spark according to the local cluster by adding a file to `./spark-1.4.1-bin-hadoop2.6/conf/slaves`. In my case the configuration file looks like

   	# A Spark Worker will be started on each of the machines listed below.
   	node180
   	node182
   	node183

1. Start Spark services on the predefined nodes of the cluster with the following command

   `./spark-1.4.1-bin-hadoop2.6/sbin/start-all.sh`

   You can check the running status of the Spark service from the root node by start a command line browser. For example, in a Linux system you can use `lynx` to check the address `http://localhost` on port `8080` with the following command

   `lynx http://localhost:8080`

   As a result, you should be about to see some information, e.g., in my case

   	[spark-logo-77x50px-hd.png] 1.4.1 Spark Master at spark://ukko178:7077                                                         
   
	        * URL: spark://ukko178:7077                                                                                               
	        * REST URL: spark://ukko178:6066 (cluster mode)                                                                           
	        * Workers: 3                                                                                                              
	        * Cores: 48 Total, 0 Used                                                                                                 
	        * Memory: 91.2 GB Total, 0.0 B Used                                                                                       
	        * Applications: 0 Running, 0 Completed                                                                                    
	        * Drivers: 0 Running, 0 Completed                                                                                         
	        * Status: ALIVE                                                                                                           
   
	   Workers                                                                                                                        
   
	      Worker Id                                                                                                                   
	      Address                                                                                                                     
	      State                                                                                                                       
   
	      Cores Memory                                                                                                                
	      worker-20150726121716-86.50.20.184-40008 86.50.20.184:40008 ALIVE 16 (0 Used) 30.4 GB (0.0 B Used)                          
	      worker-20150726121717-86.50.20.183-37887 86.50.20.183:37887 ALIVE 16 (0 Used) 30.4 GB (0.0 B Used)                          
	      worker-20150726121718-86.50.20.181-51810 86.50.20.181:51810 ALIVE 16 (0 Used) 30.4 GB (0.0 B Used)                          
   
	   Running Applications                                                                                                           
   
	      Application ID                                                                                                              
	      Name                                                                                                                        
   
	      Cores Memory per Node Submitted Time User State Duration                                                                    
   
	   Completed Applications                                                                                                         
   
	      Application ID

### Example: count lines

- The question is to count the number of lines in a big file.
- The first thing you should do is to include some necessary Python libraries

{% highlight Python%}
from pyspark import SparkContext
from pyspark import SparkConf
{% endhighlight%} 

- Then you have to configure the python script

{% highlight Python%}
APP_NAME = 'my python script'
conf = SparkConf().setAppName(APP_NAME)
conf = conf.setMaster('spark://ukko178:7077')
sc = SparkContext(conf=conf)
{% endhighlight%}

- The core part of the script is 

{%highlight Python%}
lines = sc.textFile("../spark-1.4.1-bin-hadoop2.6/README.md")
lineLength = lines.map(lambda s: len(s))
lineLengths.persist()
totalLength = lineLength.reduce(lambda a,b:a+b)
print totalLength
{%endhighlight%}

- Then you need to organize the above code into a python function, e.g., the following code 

{%highlight Python%}
from pyspark import SparkContext
from pyspark import SparkConf
def count_lines():
  # configuration
  APP_NAME = 'count lines'
  conf = SparkConf().setAppName(APP_NAME)
  conf = conf.setMaster('spark://ukko178:7077')
  sc = SparkContext(conf=conf)
  # core part of the script
  lines = sc.textFile("../spark-1.4.1-bin-hadoop2.6/README.md")
  lineLength = lines.map(lambda s: len(s))
  lineLengths.persist()
  totalLength = lineLength.reduce(lambda a,b:a+b)
  # output results
  print totalLength
if __name__ == '__main__':
  count_lines()
{%endhighlight%}

- Then you need to submit the job with the following command

  `../spark-1.4.1-bin-hadoop2.6/bin/spark-submit count_lines.py`

  You can have an overview of the programme by looking at the Spark server `lynx http://localhost:8080` during running or after finished.

- The above Python script use `lambda` expression to realize `map-reduce` operation. This can be replaced with functions that define more complicated operations. For example, the following code does the same function without `lambda` expression.

{%highlight Python%}
from pyspark import SparkContext
from pyspark import SparkConf
def count_lines_functioncall():
  # configuration
  APP_NAME = 'count lines'
  conf = SparkConf().setAppName(APP_NAME)
  conf = conf.setMaster('spark://ukko178:7077')
  sc = SparkContext(conf=conf)
  # core part of the script
  lines = sc.textFile("../spark-1.4.1-bin-hadoop2.6/README.md")
  lineLength = lines.map(count_lines_single)
  totalLength = lineLength.reduce(reducer)
  # output results
  print totalLength
def count_lines_single(lines):
  return len(lines)
def reducer(length1,length2):
  return length1+length2
if __name__ == '__main__':
  count_lines_functioncall()
{%endhighlight%}

### Example: word counts

- The question is to summary the word count in a big file.
- An example Python solution is described as the following

{%highlight Python%}
from pyspark import SparkContext
from pyspark import SparkConf
def word_count_lambdaexpression():
  # configuration
  APP_NAME = 'word count'
  conf = SparkConf().setAppName(APP_NAME)
  conf = conf.setMaster('spark://ukko178:7077')
  sc = SparkContext(conf=conf)
  # core part of the script
  lines = sc.textFile("../spark-1.4.1-bin-hadoop2.6/README.md")
  words = lines.flatMap(lambda x: x.split(' '))
  pairs = words.map(lambda x: (x,1))
  count = pairs.reduceByKey(lambda x,y: x+y)
  # output results
  for x in count.collect():
    print x
if __name__ == '__main__':
  word_count_lambdaexpression()
{%endhighlight%}

- The above Python solution uses `lambda` expression which can be replaced with functions that allow more complicated operations. For example, the following code also does the word counts

{%highlight Python%}
from pyspark import SparkContext
from pyspark import SparkConf
def word_count_functioncall():
  # configuration
  APP_NAME = 'word count'
  conf = SparkConf().setAppName(APP_NAME)
  conf = conf.setMaster('spark://ukko178:7077')
  sc = SparkContext(conf=conf)
  # core part of the script
  lines = sc.textFile("../spark-1.4.1-bin-hadoop2.6/README.md")
  table = lines.flatMap(flatmapper).map(mapper).reduceByKey(reducer)
  for x in table.collect():
    print x
def flatmapper(lines):
  return lines.split(' ')
def mapper(word):
  return (word,1)
def reducer(a, b):
  return a+b
if __name__ == '__main__':
  word_count_functioncall()
{%endhighlight%}






