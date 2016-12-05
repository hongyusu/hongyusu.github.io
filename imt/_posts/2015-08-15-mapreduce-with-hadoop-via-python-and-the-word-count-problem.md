---
layout: imt-post
title: "Mapreduce with Hadoop via Python with Examples"
description: ""
category: Technology
tags: [Hadoop, MapReduce, BigData, python]
---
Mapreduce with Hadoop via Python with Examples

# Table of content
* auto-gen TOC:
{:toc}

# Introduction

In this article I will try to set up two examples of running mapreduce functions on Hadoop by Python. Aparche Hadoop framework is originally meant for Java. However, with Hadoop streaming API we can implement mapreduce functions in Python. In particular, the input and output of mapreduce functions are handled by standard input/output stream `STDIN` and `STDOUT`. We use Python module `sys.stdin` to do the trick.

# Word count problem

1. Word count is a canonical problem which is to count the occurrences of words in a document.
1. The _mapper_ function will take in the raw text file and convert it into a collection of key-value pairs. Each key is a word, and all keys (words) will have a value of 1.
1. The _reducer_ function will summary all key-value pairs in which the values of the same key are combined. The result is a list of unique key with the count of appearance.

## Implement the mapreduce function for word count

1. With Hadoop streaming API, we aim to write a Python script acting as a mapper and a Python script acting as reducer.
1. In addition the scripts should work with data stream similar as the following

   `cat document | ./mapper.py | sort -k1,1 | ./reducer.py > output`

1. Hadoop is implemented in Java and is meant for Java. However, with Hadoop streaming package we can write our own mapreduce function based on Python. There are a few good blog about using Hadoop streaming package with Python, for example, 
   1. [Writing a Hadoop mapreduce program in Python](http://www.michael-noll.com/tutorials/writing-an-hadoop-mapreduce-program-in-python/)
   1. [Performance analysis for scaling up R computation using Hadoop](http://amodernstory.com/category/hadoop-2/)
   1. [Python mapreduce on Hadoop - a beginners tutorial](http://blog.matthewrathbone.com/2013/11/17/python-map-reduce-on-hadoop---a-beginners-tutorial.html)
1. Here we provide a step-by-step tutorial on running a python mapreduce program on Hadoop on a Macos.
1. The magic is to use Hadoop stream API which allows data pass Hadoop through `STDIN` and `STDOUT`.
1. We will be using Python `sys.stdin` and `sys.stdout` to read and write data. Hadoop will take care of other matters.

### Implement `mapper` function

- The first thing we need to do is to write a mapper function. 
- Let us call the mapper function `mapper.py`.
- The function will read in a partition of data (probably a section of a file) from the standard input stream `STDIN` and output key and value pairs.
- An example `mapper.py` is given as the following

```python
#!/usr/bin/env python
import sys
def main():
  for line in sys.stdin:
    words = line.strip().split()
    for word in words:
      print "%s\t1" % word
if __name__ == "__main__":
  main()
```

- It is worth noting that the first line is important which make the script executable by Hadoop.
- Make sure `mapper.py` are accessible by executing the command `chmod a+X mapper.py`

### _shuffle_ procedure

- The operation between mapper reducer is sometimes called _shuffle_
  - All key-value pairs are sorted according to the key before send to reducer.
  - All pairs with the same key are send to the same reducer.
- The shuffle process is important because
  - As the reducer are reading data stream, if it comes across a key that is different from the previous one, it knows that the previous key will never appear again.
  - If all key-value pair share the same key, it ends up with only one reducer. There is no parallelization in this case.

### Implement `reducer` function

- Now we are going to implement `reducer.py`.
- The function will get input from standard output stream `STDOUT` which is the output of the mapper function, process the data and write to `STDOUT`.
- An example `reducer.py` is shown as the following

{% highlight python linenos %}
#!/usr/bin/env python
import sys
def main():
  curword = None
  curcount = 0
  for line in sys.stdin:
    word,count=line.strip().split('\t')
    if curword == None:
      curword = word
      curcount = 1
      continue
    if curword == word:
      curword = word
      curcount += 1
    else:
      print "%s\t%d" %(curword,curcount)
      curword = word
      curcount = eval(count)
  print "%s\t%d" %(curword,curcount)
if __name__=='__main__':
  main()
{% endhighlight %}

- Make sure `reducer.py` are accessible by executing the command `chmod a+X reducer.py`. 

## Submit the mapreduce program to Hadoop cluster

### Start local Hadoop server

1. If you have followed my instruction to [set hadoop on MacOS](http://hongyusu.github.io/programming/2015/07/27/setup-hadoop-on-macos/), you can start Hadoop server with command `hstart`
1. Use command `jps` to check if everything is fine with your Hadoop. In particular, you should have the following servers up and running

   	8257 Jps
   	6214 NameNode
   	6550 ResourceManager
   	6424 SecondaryNameNode
   	6651 NodeManager
   	8172 DataNode

1. You might come across the problem that the datanode is missing which means you did not manage to start the datanode. To start the datanode, you can
   1. Stop all Hadoop services with `hstop`.
   1. Format the HDFS filesystem with `hdfs datanote -format`.
   1. Restart all Hadoop services with `hstart`.

1. If the above does not work or you don't care about the data on the HSDF, you can 
   1. Stop all Hadoop services with `hstop`.
   1. delete all file in `<name>hadoop.tmp.dir</name>` which is specified in the configuration file located (in my case) `/usr/local/Cellar/hadoop/2.7.1/libexec/etc/hadoop/Core-site.xml`.
   1. Format the HDFS filesystem with `hdfs datanote -format`.
   1. Restart all Hadoop services with `hstart`.

1. The latter alternative works at least for me.

### Copy data files to HDFS

1. First, let's download a big text file with the following command 

   `curl -O http://www.gutenberg.org/files/5000/5000-8.txt`

   As command `curl` is for Macos, you might want to use other alternatives, e.g. `wget` in other Linux machine

1. Move the data file to the Hadoop file system with the following command

   `hadoop fs -put 5000-8.txt /`

1. Make sure that you have the file in the HDFS with the command `hadoop fs -ls /`

### Submit job to Hadoop

- Now, we should submit the job to Hadoop by calling its streaming function with the following command

{% highlight bash linenos %}
hadoop jar \
     /usr/local/Cellar/hadoop/2.7.1/libexec/share/hadoop/tools/lib/hadoop-streaming-2.7.1.jar  \
     -files ./mapper.py,./reducer.py \
     -mapper mapper.py -reducer reducer.py \
     -input /5000-8.txt -output /tmp
{% endhighlight %}

- In case there are something wrong with codes, you should delete the result file from HDFS and run the above command again. Remove the previous result file with command `hadoop fs -rm -r /tmp`

- Check the result with command `hadoop fs -cat /user/su/wc_out/part-00000`

#Line count problem

Line count problem is to count the number of lines in a documents which can be accomplished by a mapreduce heuristics. Basically, the `mapper` function reads data one line by another and returns 1 after each line, and the `reducer` function sums up the returned valued.

## Implement `mapper.py`

The `mapper` function is given as the following
{% highlight python linenos %}
#!/usr/bin/env python
import sys
def main():
  for line in sys.stdin:
    print "1"
if __name__ == "__main__":
  main()
{% endhighlight %}

## Implement `reducer.py`

The `reducer` function is given as the following 
{% highlight python linenos %}
#!/usr/bin/env python
import sys
def main():
  sum = 0
  for line in sys.stdin:
    sum+=1
  print "%s" % sum
if __name__=='__main__':
  main()
{% endhighlight %}
 
