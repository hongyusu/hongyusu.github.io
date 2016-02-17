---
layout: post
title: "Compute TF-IDF with Hadoop Python"
description: ""
category: Technology
tags: [Hadoop, MapReduce, BigData, Python]
---
{% include JB/setup %}



<script type="text/javascript"
 src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>

# Table of content
* auto-gen TOC:
{:toc}

# Introduction

If you have read my article about [Hadoop Python with streaming API](http://hongyusu.github.io/programming/2015/08/15/mapreduce-with-hadoop-via-python-and-the-word-count-problem/) this is an extension.

# Datasets
I will use the same dataset as in the [previous article](http://hongyusu.github.io/programming/2015/08/15/mapreduce-with-hadoop-via-python-and-the-word-count-problem/). In addition, I generate other four set of data by sampling lines randomly from `5000-8.txt`. Before running Hadoop mapreduce, these datasets need to be uploaded to Hadoop HSDF with the command `hadoop fs -put 5000* /`. Take a look at the HDFS with `hadoop fs -ls /`.

	Hongyu-MacBook-Air:simpleExample su$ hadoop fs -ls /
	Found 5 items
	-rw-r--r--   1 su supergroup    1428841 2015-08-16 12:13 /5000-5.txt
	-rw-r--r--   1 su supergroup     447003 2015-08-16 12:13 /5000-6.txt
	-rw-r--r--   1 su supergroup     904220 2015-08-16 12:13 /5000-7.txt
	-rw-r--r--   1 su supergroup    1428841 2015-08-16 12:13 /5000-8.txt
	-rw-r--r--   1 su supergroup     395608 2015-08-16 12:13 /5000-9.txts

In this article, I will be computing the TF-IDF from these files.

# Compute term frequency (TF)

## `mapper` function

```python
#!/usr/bin/env python
import sys
import os
def tfmapper():
  for line in sys.stdin:
    words = line.strip().split()
    for word in words:
      print "%s\t%s\t1" % (word,os.getenv('mapreduce_map_input_file','noname'))
if __name__ == '__main__':
  tfmapper()
```

## `reducer` function

```python
#!/usr/bin/env python
import sys
def tfreducer():
  curprefix = None
  curcount = None
  for line in sys.stdin:
    word,filename,count = line.strip().split('\t')
    prefix = '%s\t%s' % (word,filename)
    if curprefix == None:
      curprefix = prefix
      curcount = eval(count)
    elif curprefix == prefix:
      curcount += eval(count)
    else:
      print "%s\t%s" % (curprefix,curcount)
      curprefix = prefix
      curcount = eval(count)
  print "%s\t%s" % (curprefix,curcount)
if __name__=='__main__':
  tfreducer()
```

## Deploy mapreduce functions on Hadoop

When deploy the mapreduce functions on Hadoop, we can use wild card in the input filename such that all files match the wild card will be sent to input stream. In particular, we can submit the above mapreduce function with the following command

```bash
hadoop jar \
     /usr/local/Cellar/hadoop/2.7.1/libexec/share/hadoop/tools/lib/hadoop-streaming-2.7.1.jar \
     -files ./mapper.py,./reducer.py \
     -mapper tfmapper.py \
     -reducer tfreducer.py \
     -input /5000-* \
     -output /tmp
```

Take a look at the output `hadoop fs -cat /tmp/par*|head -50`

	Hongyu-MacBook-Air:tfidf su$ hadoop fs -cat /tmp/par*|head -50
	"(Lo)cra"	hdfs://localhost:9000/5000-7.txt	1
	"(Lo)cra"	hdfs://localhost:9000/5000-5.txt	1
	"(Lo)cra"	hdfs://localhost:9000/5000-8.txt	1
	"1490	hdfs://localhost:9000/5000-8.txt	1
	"1490	hdfs://localhost:9000/5000-5.txt	1
	"1490	hdfs://localhost:9000/5000-9.txt	1

It is obvious that each line in the output is `word-file-count`.

# Compute Document frequency (DF)

Document frequency (DF) of a word $$w_i$$ is by definition the ratio between the number of documents having word $$w_i$$ and the total number of documents.

## Data file

We will use the result file from the last step. In particular, we copy and rename the result file into HDFS `hadoop fs -cp /tmp/part-00000 /tf`

## `mapper` function

The `mapper` function will read each record from the above result and add 1 to the end of each record. An example `mapper` function is given as the following

```python
#!/usr/bin/env python
import sys
import os
def dfmapper():
  for line in sys.stdin:
    print "%s\t1" % line.strip()
if __name__ == '__main__':
  dfmapper()
```


## `reduce` function

The `reducer` function will for each word read corresponding records into a buffer and compute the number of documents having the word. In the end, it will output all record from the buffer and add the number of the documents to the end of each record.

```python
#!/usr/bin/env python
import sys
def dfreducer():
  curword = None
  curcount = None
  space = []
  for line in sys.stdin:
    word,filename,wordcount,count = line.strip().split()
    prefix = "%s\t%s\t%s" %(word,filename,wordcount)
    if word == None:
      curword = word
      curcount = eval(count)
      space.append(prefix)
    elif curword == word:
      curcount += eval(count)
      space.append(prefix)
    else:
      for item in space:
        print "%s\t%d" % (item,curcount)
      curword = word
      curcount = eval(count)
      space = [prefix]
  for item in space:
    print "%s\t%d" % (item,curcount)
if __name__=='__main__':
  dfreducer()
```

## Deploy mapreduce functions on Hadoop

Now, we need to submit the mapreduce function to Hadoop. We need to clarify mapper function `dfmapper.py` and reducer function `dfreduce.py`, as well as input data file in HDFS. The following command can be used to submit the job

```bash
hadoop jar \
     /usr/local/Cellar/hadoop/2.7.1/libexec/share/hadoop/tools/lib/hadoop-streaming-2.7.1.jar \
     -files ./dfmapper.py,./dfreducer.py \
     -mapper dfmapper.py -reducer dfreducer.py \
     -input /tf -output /tmp
```

As a results, we have each line from the result file with the format `word-file-tfcount-dfcount`

	Hongyu-MacBook-Air:tfidf su$ hadoop fs -cat /tmp/par*
	"(Lo)cra"	hdfs://localhost:9000/5000-5.txt	1	3
	"(Lo)cra"	hdfs://localhost:9000/5000-8.txt	1	3
	"(Lo)cra"	hdfs://localhost:9000/5000-7.txt	1	3
	"1490	hdfs://localhost:9000/5000-8.txt	1	3
	"1490	hdfs://localhost:9000/5000-5.txt	1	3
	"1490	hdfs://localhost:9000/5000-9.txt	1	3
	"1498,"	hdfs://localhost:9000/5000-9.txt	1	3
	"1498,"	hdfs://localhost:9000/5000-8.txt	1	3


# Compute TF-IDF

With the result from last step, it is straight forward to compute TF-IDF of a word. For a Hadoop implementation, we just need a `mapper` function to compute the value for each record and a `reduce` function which does not perform any operation.



