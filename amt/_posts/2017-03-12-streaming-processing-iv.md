---
layout: amt-post 
title: "Streaming with Apache Storm"
location: Helsinki
tags: [Streaming]
---

Several previous posts briefly demonstrate some of my experiences on streaming data processing using mostly Kafka and Spark. Still we need to remember that we have realtime processing capability via Kafka and near-realtime processing capability using Spark. This is mostly due to the fact that Spark processes a stream of RDDs generated by some time window. In this article, let me quickly walk through some basic idea and example of streaming data processing using Apache Storm which is another popular streaming processing framework. Sadly, storm is not part of Cloudera package. So if you have a sandbox with Cloudera and you will be missing this storm. 

# Related articles

1. [Streaming processing (III): Best Spark Practice](/amt/streaming-processing-iii.html)
1. [Streaming processing (II):  Best Kafka Practice](/amt/streaming-processing-ii.html)
1. [Streaming processing (I):   Kafka, Spark, Avro Integration](/amt/spark-streaming-kafka-avro-and-registry.html)

# Table of content
* auto-gen TOC:
{:toc}

# Package and versions

The following packages are required.

| Packages           | Version  | Repository                                 |
|:-------------------|---------:|-------------------------------------------:|
| mvn                | 3.3.9    |                                            | 
| gradle             | 3.3      |                                            |
| storm              | 1.0.3    | git@github.com:hongyusu/storm.git          |


# Storm build and installation

1. Download the source code of *storm* from [repo](git@github.com:hongyusu/storm.git), enter the source directory, and build the code with *maven* 

   ```shell
   mvn clean install -DskipTests=true
   cd storm-dist/binary/
   mvn package -Dgpg.skip -Dtest.skip
   ```

1. Find the release package and unpack the tar ball 

   ```shell
   cd target
   tar xvvf apache-storm-1.0.3.tar.gz
   ```

1. Run from the *bin/* folder inside the release package and you are ready to go.


# Build streaming workflow with storm

Storm seems to have a pretty rich collection of APIs for connecting sources and processing streaming data. In addition, there is a so called _trident_ API that provides, in my opinion APIs.
I will make two separate examples in the following subsections using storm native APIs and trident APIs.
Again source code can be found from [my git:bigdata:storm][stormpackage].

## Storm native API

Basically, to use native Storm API, I need to implement the interface of *Spout* and *Bolt*. For each of these, I need to follow the definition of the interface to implement a collection of processing functions.
 
Complete code can be found from [my Github:bigdata:storm:native][stormnativeapi]

1. Define a Storm processing topology

   ```java
   TopologyBuilder builder = new TopologyBuilder();
   builder.setSpout("spout", new RandomSentenceSpout(), 5);
   builder.setBolt("split", new SplitSentence(), 8).shuffleGrouping("spout");
   builder.setBolt("count", new WordCount(), 12).fieldsGrouping("split", new Fields("word"));
   ```

   The topology does the classical word count trick. The streaming flow starts from a input *spout* in Storm terminology. There two processing component *bolt* which does splitting sentences into words and counts the occurrence of each words. 

1. Define the *spout* (source)

   The source of this stream is a spout generating constantly some random sentences. I was a bit lazy here just to use a default Storm class *RandomSentenceSpout*.

1. Define the *bolt* (processing unit)
   
   To write a bolt class, one needs to implement a interface e.g. *BaseRichBolt* in which *execute()* and *declareOutputFields()* functions need to be instantiated.

   - The first bolt to split sentence into words

     ```java
     public static class SplitSentence extends BaseRichBolt {
         OutputCollector _collector;
         @Override
         public void prepare(Map conf, TopologyContext context, OutputCollector collector) {
             _collector = collector;
         }
         @Override
         public void execute(Tuple tuple) {
             String[] words = tuple.getString(0).split(" ");
             for (String word : words) {
                 _collector.emit(tuple, new Values(word));
                 _collector.ack(tuple);
             }
         }
         @Override
         public void declareOutputFields(OutputFieldsDeclarer declarer) {
             declarer.declare(new Fields("word"));
         }
     }
     ```

   - The second bolt to count the occurrence of words

     ```java
     public static class WordCount extends BaseBasicBolt {
         Map<String, Integer> counts = new HashMap<String, Integer>();
 
         @Override
         public void execute(Tuple tuple, BasicOutputCollector collector) {
             String word = tuple.getString(0);
             Integer count = counts.get(word);
             if (count == null)
                 count = 0;
             count++;
             counts.put(word, count);
             collector.emit(new Values(word, count));
         }
         @Override
         public void declareOutputFields(OutputFieldsDeclarer declarer) {
             declarer.declare(new Fields("word", "count"));
         }
     }
     ```

1. Fix the *gradle.build* file by

   - Adding dependencies required

     ```shell
     dependencies {
         compile( 'org.apache.storm:storm-core:1.0.3' )
         compile( 'org.apache.storm:storm-starter:1.0.3' )
         compile( 'org.apache.storm:storm-kafka:1.0.3' )
         compile( 'org.apache.storm:storm:1.0.3' )
  
     }
     ```

   - Adding a task to generate a fat jar including all required dependencies

     ```shell
     task fatJar(type: Jar){
         zip64 true
             description = "Assembles a Hadoop ready fat jar file" 
         baseName = project.name + '-all' 
             doFirst {
             from {
                 configurations.compile.collect { it.isDirectory() ? it : zipTree(it) }
             }
             }
             manifest {
                 attributes( "Main-Class": "${archivesBaseName}/${mainClassName}")
             }
         exclude 'defaults.yaml','META-INF/*.RSA','META-INF/*.SF','META-INF/*.DSA'
         with jar 
     }
     ```

1. Compile with 

   ```shell
   gradle fatjar
   ```

   And run with storm command in the release package generated in the beginning of this post

   ```shell
   /Users/hongyusu/Codes/Packages/storm/storm-dist/binary/target/apache-storm-1.0.3/bin/storm jar build/libs/etl_storm-all.jar etl_storm.WordCountTopology
   ```


## Storm trident API

I think Storm native API is not as friendly as it should be. If you think about the concept of functional programming and as the instantiation of e.g. Spark, Kafka, Cascading, one would expect similar operations in Storm. Luckily, Storm has this *trident* API which offer similar interfaces. And I think this is just great. 

The following Storm trident example offers two isolated functionalities but I just put them together in one Java class.

- Generate random sentences into a Kafka stream
- Read sentences from a Kafka Stream and count the occurrence of each words

Complete code can be found from [my Github:bigdata:storm:trident][stormtridentapi]


1. First we need to define the topology for these two functionalities

   ```java
   cluster.submitTopology("wordCounter", wordCount.getConsumerConfig(), wordCount.buildConsumerTopology(drpc));
   cluster.submitTopology("kafkaBolt", conf, wordCount.buildProducerTopology(wordCount.getProducerConfig()))
   ```

1. Generate random sentence to a Kafka Stream

   ```java
   public StormTopology buildProducerTopology(Properties prop) {
       TopologyBuilder builder = new TopologyBuilder();
       builder.setSpout("spout", new RandomSentenceSpout(), 2);
   
       KafkaBolt bolt = new KafkaBolt().withProducerProperties(prop)
               .withTopicSelector(new DefaultTopicSelector("testout"))
               .withTupleToKafkaMapper(new FieldNameBasedTupleToKafkaMapper("key", "word"));
       builder.setBolt("forwardToKafka", bolt, 1).shuffleGrouping("spout");
       return builder.createTopology();
   }
   ```
  
   The block of code generates random sentences from a Storm Spout and send into a Kafka Stream with name *testout*.

1. Word count from an input Kafka Stream  


   - Define a Spout taking data from a Kafka stream

     ```java
     private TransactionalTridentKafkaSpout createKafkaSpout() {
         ZkHosts hosts = new ZkHosts(zkUrl);
         TridentKafkaConfig config = new TridentKafkaConfig(hosts, "testin");
         config.scheme = new SchemeAsMultiScheme(new StringScheme());
         config.startOffsetTime = kafka.api.OffsetRequest.EarliestTime();
         return new TransactionalTridentKafkaSpout(config);
     }
     ```
     
   - Define the topology

     ```java
     private TridentState addTridentState(TridentTopology tridentTopology) {
         return tridentTopology.newStream("spout1", createKafkaSpout()).parallelismHint(1)
                 .each(new Fields("str"), new Split(), new Fields("word"))
                 .groupBy(new Fields("word"))
                 .persistentAggregate(new MemoryMapState.Factory(), new Count(), new Fields("count"))
                 .parallelismHint(1);
     }
     ```

     The topology will read data from the Kafka source, split sentences into words, and count the occurrence of each words and store into memory which can be queried on the fly 


1. Compile with *gradle* 

   ```shell
   gradle fatjar
   ```

   And run with

   ```shell
   /Users/hongyusu/Codes/Packages/storm/storm-dist/binary/target/apache-storm-1.0.3/bin/storm jar build/libs/etl_storm-all.jar etl_storm.TridentKafkaWordCount
   ```

   At the same time, there should be a Kafka console producer constantly sending data (sentences) into the topic "testin"

# Conclusion

In addition to Spark and Kafka, Storm is another good tool under Apache for streaming data processing. Storm provides both native API and so-called trident API which is a bit better and human friendly. With storm, one can implements real-time streaming processing which is similar to the concept of Kafka KStream but is different from Spark Streaming. However, Storm is not part of Cloudera.

    

[stormpackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_spark
[stormkbuild]:   https://github.com/hongyusu/bigdata_etl/blob/master/etl_storm/build.gradle

[stormnativeapi]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_spark/src/main/etl_storm/WordCountTopology.java
[stormtridentapi]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_spark/src/main/etl_storm/TridentKafkaWordCount.java



