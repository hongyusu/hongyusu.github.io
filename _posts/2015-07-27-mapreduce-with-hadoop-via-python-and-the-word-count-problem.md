---
layout: post
title: "Mapreduce with Hadoop via Python and the word count problem"
description: ""
category: Programming
tags: [Programming, Hadoop, mapreduce, bigdata, python]
---
{% include JB/setup %}

Here we are trying to set up an example of running mapreduce functionality on Hadoop via Python. This can be accomplished via Hadoop streaming API. In particular, the input and output of mapreduce functions are handled by standard input/output stream `STDIN` and `STDOUT`. We use `sys.stdin` of Python to do the trick.

## Python mapreduce for word count problem
1. Word count is a canonical problem which is to count the occurrences of words in a document or a collection of documents. 
1. The _mapper_ function will take in the raw text and convert it into a collection of key-value pairs. Each key is a word, and all keys (words) will have a value of 1.
1. The _reducer_ function will summary all key-value pairs in which the values of the same key are combined. The result is a list of unique key with the count of appearance.
1. With Hadoop streaming API, we aim to write a Python script acting as a mapper and a Python script acting as reducer.
1. In addition the scripts should work with data stream similar as the following

   `cat document | ./mapper.py | sort -k1,1 | ./reducer.py > output`

### Implement the mapreduce program

1. Hadoop is implemented in Java and is meat for Java. However, with Hadoop streaming package we can write our own mapreduce function based on Python. There are a few good blog about using Hadoop streaming package with Python, for example, 
   1. [Writing a Hadoop mapreduce program in Python](http://www.michael-noll.com/tutorials/writing-an-hadoop-mapreduce-program-in-python/)
   1. [Performance analysis for scaling up R computation using Hadoop](http://amodernstory.com/category/hadoop-2/)
   1. [Python mapreduce on Hadoop - a beginners tutorial](http://blog.matthewrathbone.com/2013/11/17/python-map-reduce-on-hadoop---a-beginners-tutorial.html)
1. Here we provide a step-by-step tutorial on running a python mapreduce program on Hadoop on a Macos

- The trick behind the scene/magic is to use Hadoop stream API which allows data pass Hadoop through `STDIN` and `STDOUT`.
- We will be using Python `sys.stdin` and `sys.stdout` to read and write data. Hadoop will take care of other matters.

- The first thing we need to do is to write a mapper function. 
  - Let us call the mapper function `mapper.py`.
  - The function will read in a partition of data (probably a section of a file) from the standard input stream `STDIN` and output key and value pairs.
  - The simple `mapper.py` function is given as the following
{%highlight python%}
#!/user/bin/env python
import sys
for line in sys.stdin:
    words = line.strip().split()
    for word in words:
        print '%s\t%s' % (word, 1)
{%endhighlight%}

- The operation between mapper reducer is sometimes called _shuffle_
  - All key-value pairs are sorted according to the key before send to reducer.
  - All pairs with the same key are send to the same reducer.
- The shuffle process is important because
  - As the reducer are reading data stream, if it comes across a key that is different from the previous one, it knows that the previous key will never appear again.
  - If all key-value pair share the same key, it ends up with only one reducer. There is no parallelization in this case.

- Then we need to write a reducer function.
  - The function will get input from standard output stream `STDOUT` which is the output of mapper function, process the data and write to `STDOUT`.
  - Let us name the funct
ion `reducer.py` which is given as the following code
{%highlight python%}
#!/user/bin/env python
import sys
current_word = None
current_count = 0
word = None
for line in sys.stdin:
    word,count = line.strip().split('\t')
    try:
        count = int(count)
    except ValueError:
        continue
    if current_word == word:
        current_count += count

    else:
        if current_word:
            print '%s\t%s' % (current_word, current_count)
        current_count = count
        current_word = word
if current_word == word:
    print '%s\t%s' % (current_word, current_count)
{%endhighlight%}

- Oh, make sure `mapper.py` and `reducer.py` are accessible with the following command

  `chmod a+X mapper.py reducer.py` 

### Submit the program to Hadoop

1. Let download a somehow big text with the following command

   `curl -O http://www.gutenberg.org/files/5000/5000-8.txt`

   As this is for Macos, we use `curl`. For other Linux system, you might use e.g., `wget`.

1. Move the data file to the Hadoop file system with the following command

   `hadoop fs -put data_wc /user/su/`

   Then, check the file in the system with the following command

   `hadoop fs -ls /user/su/`

1. Now, we should submit the job to Hadoop by calling its streaming function with the following command

   `hadoop jar /usr/local/Cellar/hadoop/2.7.1/libexec/share/hadoop/tools/lib/hadoop-streaming-2.7.1.jar -files ./mapper.py,./reducer.py -mapper mapper.py -reducer reducer.py -input /user/su/data_wc -output /user/su/wc_out`

1. If something goes wrong, result directory can be deleted with the following command

   `hadoop fs -rm -r /user/su/wc_out`

1. Check the result directory with the following command

   `hadoop fs -ls /user/su/wc_out/`

1. Check the result with the following command

   `hadoop fs -cat /user/su/wc_out/part-00000`





 
