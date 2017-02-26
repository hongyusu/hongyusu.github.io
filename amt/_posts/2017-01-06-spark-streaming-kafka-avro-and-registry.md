---
layout: amt-post 
title: "Streaming processing (I): Kafka, Spark, Avro Integration"
location: Helsinki
tags: [Streaming]
---


Streaming data processing is yet another interesting topic in data science. In this article, we will walk through the integration of Spark streaming, Kafka streaming, and Schema registry for the purpose of communicating Avro-format messages. Spark, Kafka and Zookeeper are running on a single machine (standalone cluster). The actual configurations of Spark, Kafka, and Zookeeper are to some extend irrelevant to this integration.  
  

# Related articles

1. [Streaming processing (III): Best Spark Practice](/amt/streaming-processing-iii.html)
1. [Streaming processing (II):  Best Kafka Practice](/amt/streaming-processing-ii.html)
1. [Streaming processing (I):   Kafka, Spark, Avro Integration](/amt/spark-streaming-kafka-avro-and-registry.html)

# Table of content
* auto-gen TOC:
{:toc}

# Architecture

1. Data preparation
   1. Data are prepared as in Kafka topics by Kafka producer
1. Data processing
   1. Consume data via Kafka consumer or KStream processor
   1. Concume data via Spark streaming processor 
1. Data provision
   1. Kafka producer will provide the processed data
   1. KStream prossor will provide the processed data
1. Schema validation
   1. Schema registry server will check and verify schema


# Code repository

All implementation can be found from my code repository [bigdata ETL - kafka streaming](https://github.com/hongyusu/bigdata_etl/tree/master/etl_kafka) and  [bigdata ETL - spark streaming](https://github.com/hongyusu/bigdata_etl/tree/master/etl_spark).

NOTE: implementation in this post is no loger maintained. please check the second and third part for more detailed implementation.
- [Streaming processing (III): Best Spark Practice](/amt/streaming-processing-iii.html)
- [Streaming processing (II):  Best Kafka Practice](/amt/streaming-processing-ii.html)

# Installations  

We need Spark, Kafka, Zookeeper, and schema registry server installed before running through the actual integration. The following installation guide targets OsX and will produce a standalone cluster.

1. First, _brew_ needs to be installed on OsX

   ```bash
   /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   ```

1. Install Kafka via _brew_. Zookeeper comes as a extra as it is part of this Kafka distribution for OsX

   ```bash
   brew install kafka
   ```

1. Spark can be 'installed' by downloading the distribution from [Spark download page](http://spark.apache.org/downloads.html).

1. Schema registry from confluent.io will be 'installed' by downloading the distribution from [confluent.io installation](http://docs.confluent.io/3.0.0/installation.html#installation).

1. Install _gradle_ in order to compile the project codes written in Java

   ```bash
   brew install gradle
   ```

# Kafka CLI operations

Kafka can operate in Command-Line-Interface (CLI) mode where messages can be produced and consumed by Kafka via Kafka shell command.

1. Kafka won't work without Zookeeper, so first Zookeeper needs to be started

   ```bash
   zkserver start
   ```

1. Start Kafka server

   ```bash
   kafka-server-start /usr/local/etc/kafka/server.properties
   ```

1. Create a topic, _zookeeper URL_, _partition_, and _replication factor_ need to be given as input parameters. _partition_ defines the number of Kafka brokers (Kafka servers) and _replication factor_ defines how many times each message will be replicated. We use default value `partition=1` and `replication-factor=1` running as standalone cluster. 

   ```bash
   kafka-topics --zookeeper localhost:2181 --create --topic test --partition 1 --replication-factor 1
   ```

1. Start a Kafka producer to generate messages to the queue, _broker server url_ need to be specified

   ```bash
   kafka-console-producer --topic test --broker-list localhost:9092
   ```

   Type in messages one line by another in console or send a file to Kafka stream 

   ```bash
   kafka-console-producer --topic test --broker-list localhost:9092 < test.csv
   ```

1. Start Kafka consumer after which messages being sent to Kafka stream will be consumed and printed to the screen 

   ```bash
   kafka-console-consumer --zookeeper localhost:2181 --topic test
   ```


# Kafka integration via Java API 

## Dependency

The following _Kafka_ and _Spark_ versions are compatible and should work together. In short, Kafka version 0.10.1.0 should be paired with spark version 1.6.2. In practice, the following _gradle_ dependencies need to be added to gradle build script.

```
compile( 'org.apache.kafka:kafka-clients:0.10.1.0' )           
compile( 'org.apache.kafka:kafka_2.10:0.10.1.0' )              
compile( 'org.apache.spark:spark-core_2.10:1.6.2')             
compile( 'org.apache.spark:spark-streaming_2.10:1.6.2')        
compile( 'org.apache.spark:spark-streaming-kafka_2.10:1.6.2' ) 
```

## Kafka producer in Java  

1. Complete code can be found from [KafkaCustomerProducer.java](https://github.com/hongyusu/bigdata_etl/blob/master/streaming/src/main/java/streaming/KafkaCustomerProducer.java)
1. Write up the code in Java 

   ```java
   Properties props = new Properties();
   props.put("bootstrap.servers", "localhost:9092");
   props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
   props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

   KafkaProducer<String, String> producer = new KafkaProducer<>(props);

   for (int i = 0; i < 100; i++) {
           ProducerRecord<String, String> record = new ProducerRecord<>("test", "value-" + i);
           producer.send(record);
   }
   
   producer.close();
   ```
   The will generate to a Kafka _test_ topic 100 lines of records.

1. Compile and run
   1. Code should be compiled with _gradle_. First, generate a gradle wrapper

      ```bash
      gradle wrapper
      ``` 

   1. Add the following line to specify which class will be run by gradle 

      ```bash
      mainClassName = 'streaming.KafkaCustomerProducer'
      ``` 

   1. Compile the code with gradle wrapper

      ```bash
      ./gradlew build
      ```

   1. The most straight forward way is to run by gradle wrapper

      ```bash
      ./gradlew run 
      ```

   1. As an alternative, build a fatJar by adding the following stuffs to `build.gradle`

      ```
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
          exclude 'META-INF/*.RSA','META-INF/*.SF','META-INF/*.DSA'
          with jar 
      }
      ```

      With all dependencies compiled to a fatJar, the package can be submited to _Spark_ engine

      ```bash
      ./gradlew fatJar
      spark-submit --class streaming.KafkaCustomerProducer streaming.jar
      ``` 

   1. While the code is running, execute a Kafka consumer eating messages from topic _test_.

      ```bash
      kafka-console-consumer --zookeeper localhost:2181 --topic test
      ```

      Records streamed from Kafka Java producer will be received and printed out directly to the terminal.
      
   
## Kafka stream consumer via Java API 

1. Complete code can be found from [KafkaCustomerConsumer.java](https://github.com/hongyusu/bigdata_etl/blob/master/streaming/src/main/java/streaming/KafkaCustomerConsumer.java)
1. Write up code in Java 

   ```java
   Properties props = new Properties();
   props.put("bootstrap.servers", "localhost:9092");
   props.put("group.id", "mygroup");
   props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
   props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
   
   KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
   consumer.subscribe(Arrays.asList("test"));
   
   boolean running = true;
   while (running) {
        ConsumerRecords<String, String> records = consumer.poll(100);
        for (ConsumerRecord<String, String> record : records) {
                System.out.println(record.value());
        }
   }
   
   consumer.close();
   ```

1. Compile and run 
   1. Add the following line to specify which class will be run by gradle 

      ```
      mainClassName = 'streaming.KafkaCustomerConsumer'
      ``` 

   1. Follow the same principle, the code can be run via _gradle_ wrapper or _spark_.
   1. While the Java Kafka consumer is running, execute a Kafka producer from command line

      ```bash
      kafka-console-producer --topic test --broker-list localhost:9092
      ```  

      or 

      ```bash
      kafka-console-producer --topic test --broker-list localhost:9092 < test.csv
      ```  

      messages populated to Kafka topic _test_ will be consumed and printed out to the terminal.

# Kafka Avro producer in Java  

1. Complete code can be found from [KafkaAvroProducer.java](https://github.com/hongyusu/bigdata_etl/blob/master/streaming/src/main/java/streaming/KafkaAvroProducer.java)

1. Add _twitter bijection_ dependencies to work with Avro format

   ```
   compile( 'org.apache.avro:avro:1.8.0' )
   compile( 'com.twitter:bijection-avro_2.10:0.9.2' )
   ```

   and import packages

   ```java
   import com.twitter.bijection.Injection;
   import com.twitter.bijection.avro.GenericAvroCodecs;
   ```

1. Schema is defined as a JSON string

   ```java
   public class SchemaDefinition{
   
       public static final String AVRO_SCHEMA_testout =
               "{"
               + "\"type\":\"record\","
               + "\"name\":\"testout\","
               + "\"fields\":["
               + "  {\"name\":\"testout_date\",\"type\":\"string\" },"
               + "  {\"name\":\"testout_time\",\"type\":\"string\" },"
               + "  {\"name\":\"testout_name\",\"type\":\"string\" },"
               + "  {\"name\":\"testout_address\",\"type\":\"string\" },"
               + "  {\"name\":\"testout_country\",\"type\":\"string\" },"
               + "  {\"name\":\"testout_info_6\",\"type\":\"string\" },"
               + "  {\"name\":\"testout_info_7\",\"type\":\"string\" },"
               + "  {\"name\":\"testout_info_8\",\"type\":\"string\" },"
               + "  {\"name\":\"testout_info_9\",\"type\":\"string\" },"
               + "  {\"name\":\"testout_info_0\",\"type\":\"string\" }"
               + "]}";
   
       public static final String AVRO_SCHEMA_test =
               "{"
               + "\"type\":\"record\","
               + "\"name\":\"test\","
               + "\"fields\":["
               + "  {\"name\":\"date\",\"type\":\"string\" },"
               + "  {\"name\":\"time\",\"type\":\"string\" },"
               + "  {\"name\":\"name\",\"type\":\"string\" },"
               + "  {\"name\":\"address\",\"type\":\"string\" },"
               + "  {\"name\":\"country\",\"type\":\"string\" },"
               + "  {\"name\":\"info_6\",\"type\":\"string\" },"
               + "  {\"name\":\"info_7\",\"type\":\"string\" },"
               + "  {\"name\":\"info_8\",\"type\":\"string\" },"
               + "  {\"name\":\"info_9\",\"type\":\"string\" },"
               + "  {\"name\":\"info_0\",\"type\":\"string\" }"
               + "]}";
   }
   ``` 

1. Define Avro schema parser by twitter bijection API

   ```
   Schema.Parser parser = new Schema.Parser();
   Schema schema = null;
   if (operation == PRODtest){
       schema = parser.parse(SchemaDefinition.AVRO_SCHEMA_test);
       topic  = "test";
   }
   Injection<GenericRecord, byte[]> recordInjection = GenericAvroCodecs.toBinary(schema);
   ```

1. Read in a CSV file and for each line in the file parse all fields according to the schema defineition. After that, build a Avro message, encode the message as a byte string, and put the byte string to kafka topic. 

   ```java
   reader = new CSVReader( new FileReader(inputFilename) );
   String[] line; 
   int messageCount = 0;
   while ( (line = reader.readNext()) != null ){
   
       messageCount ++;
   
       long startTime = System.currentTimeMillis();
       GenericData.Record avroRecord = new GenericData.Record(schema);
       for (int i = 0; i < line.length; i++){
           avroRecord.put(i,line[i]);
       }
   
       byte[] bytes = recordInjection.apply(avroRecord);
       ProducerRecord<String, byte[]> record = new ProducerRecord<>(topic, bytes);
   
       if ( syncFlag ){
           try{
               producer.send(record).get();
               System.out.println("MESSAGE(" + messageCount  + ")");
           } catch (InterruptedException | ExecutionException ex){
               ex.printStackTrace();
           }
       } else {
           producer.send(record, new KafkaAvroProducerCallback(Arrays.toString(line), messageCount, startTime));
       }
   
       Thread.sleep(250);
   }
   ```

1. Add the main class information into gradle build script

   ```
   mainClassName = 'streaming.KafkaAvroProducer'
   ```

1. Run the Kafka Avro producer. While running the producer, execute a Kafka CLI consumer to eat messages from a Kafka topic _test_

   ```bash
   kafka-console-consumer --zookeeper localhost:2181 --topic test
   ```

   The following message are sent as Kafka Avro messages

   ```
   date_1,time_1,name_1,address_1,time_1,info_6_1,info_7_1,info_8_1,info_9_1,info_0_1
   date_2,time_2,name_2,address_2,time_2,info_6_2,info_7_2,info_8_2,info_9_2,info_0_2
   ...
   ``` 

   The Kafka consumer will print out the following messages. They are not the same as input messages as they are Avro messages in byte stream 

   ```
   date_1
         time_1
               name_1address_1
                              time_1info_6_1info_7_1info_8_1info_9_1info_0_1
   
   date_2
         time_2
               name_2address_2
                              time_2info_6_2info_7_2info_8_2info_9_2info_0_2
   ...
   ```

# Spark Kafka Avro consumer in Java  

The implementation described in the previous section makes sure messages are in Avro format before sending into Kafka topic.
In this section, we introduce a consumer as implemented in Spark Streaming framework. The consumer will eat Avro message produced by Kafka Avro producer and process the Avro message via Spark Streaming map reduce operations. 

It's good to point out here the difference between Spark streaming processing/transformation and Kafka processing/transformation is that Spark engine essentially works on a stream of RDDs which are created in a certain time window/interval.

1. Complete code can be found from [SparkKafkaConsumer.java](https://github.com/hongyusu/bigdata_etl/blob/master/streaming/src/main/java/streaming/SparkKafkaConsumer.java)

1. Initialize Spark streaming context in which time window to generate RDDs is specified in `Duration.seconds()`

   ```java
   SparkConf sparkConf = new SparkConf()
           .setAppName("GFM-Spark-Consumer")
           .setMaster("local[*]");
   
   JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(batchSize));
   ```

1. Initialize Spark Stream connector connecting to Kafka topic  

   ```java
   Map<String, String> kafkaParams = new HashMap<>();
   kafkaParams.put("zookeeper.connect", zookeeperURL);
   kafkaParams.put("group.id", groupName);
   JavaPairReceiverInputDStream<String, byte[]> messages = KafkaUtils.createStream(
           jssc,
           String.class, 
           byte[].class, 
           StringDecoder.class, 
           DefaultDecoder.class, 
           kafkaParams, 
           topicMap,
           StorageLevel.MEMORY_AND_DISK_SER());
   ```

1. Data as in variable _message_ from Spark stream is just a byte array. The decoding and transformation should be implemented on top of this byte array.
1. Process the Spark Stream via Spark map reduce operations

   ```java
   if (operation == CONStest){
       JavaDStream<String> lines = messages.map( new MapperTestToTestout() );
       lines.print();
   }
   ```
   Notice that the actual mapper function is implemented via a customized function.

1. The implementation of the mapper function is as follows

   ```java
   public class MapperTestToTestout implements Function<Tuple2<String, byte[]>, String> {
   
       private static Injection<GenericRecord, byte[]> testInjection;
       static{
           Schema.Parser parserTest = new Schema.Parser();
           Schema schemaTest = parserTest.parse(SchemaDefinition.AVRO_SCHEMA_test);
           testInjection = GenericAvroCodecs.toBinary(schemaTest);
       }
   
       private static final long serialVersionUID = 1L;
   
       @Override
       public String call(Tuple2<String, byte[]> tuple2) {
   
           // output: definition of Testout in Avro 
           Injection<GenericRecord, byte[]> testoutInjection;
           Schema.Parser parserTestout = new Schema.Parser();
           Schema schemaTestout = parserTestout.parse(SchemaDefinition.AVRO_SCHEMA_testout);
           testoutInjection     = GenericAvroCodecs.toBinary(schemaTestout);
           GenericData.Record avroRecordTestout = new GenericData.Record(schemaTestout);
   
           // input: Avro message 
           GenericRecord avroRecordInput = testInjection.invert(tuple2._2()).get();
   
           avroRecordTestout.put("date",avroRecordInput.get("out_date"));
           avroRecordTestout.put("time",avroRecordInput.get("out_time"));
   
           return avroRecordTestout.toString();
       }
   
   }
   ``` 

   The decoding from byte array to Avro message is through `invert()` from _bijection_ package.
   As the function call (mapper) will be executed on every worker, variables used in this mapper call need to be defined as static variables and initialized via Java static initialization

   ```java
    private static Injection<GenericRecord, byte[]> testInjection;
    static{
        Schema.Parser parserTest = new Schema.Parser();
        Schema schemaTest = parserTest.parse(SchemaDefinition.AVRO_SCHEMA_test);
        testInjection = GenericAvroCodecs.toBinary(schemaTest);
    }
   ``` 

1. Compile and run the Spark Kafka consumer. While the Kafka Avro Producer is being executed via 

   ```
   spark-submit --class streaming.KafkaAvroProducer build/libs/streaming-all.jar
   ```

   start the Spark stream Avro consumer

   ```
   spark-submit --class streaming.SparkKafkaConsumer build/libs/streaming-all.jar
   ```


# Connect to Schema registry


## Schema registry CLI operations

1. Complete code for schema registry CLI operations can be found from [Code repository](https://github.com/hongyusu/bigdata_etl/blob/master/streaming/bin/populate_registry.sh).

1. Schema registry can be obtained from confluent.io by downloading the distribution. Then, start schema registry server

   ```
   cd confluent-3.0.0/bin/
   # start registry server
   schema-registry-start ../etc/schema-registry/schema-registry.properties
   ```

   1. For test integration, we disable schema registry backwards compatibility checking 

      ```
      # disable compatibility check
      curl -X PUT http://localhost:8081/config \
          -H "Content-Type: application/vnd.schemaregistry.v1+json" \
          --data '{"compatibility": "NONE"}'
      ```

   1. Define new schemas as a JSON string in a shell script. Schema _test_ and _testout_ are defined as follows

      ```
      schemaTest='{"schema":'\
      '  "{\"type\":\"record\",'\
      '    \"name\":\"test\",'\
      '    \"fields\":['\
      '                {\"name\":\"date\",\"type\":\"string\" },'\
      '                {\"name\":\"time\",\"type\":\"string\" },'\
      '                {\"name\":\"name\",\"type\":\"string\" },'\
      '                {\"name\":\"address\",\"type\":\"string\" },'\
      '                {\"name\":\"country\",\"type\":\"string\" },'\
      '                {\"name\":\"info_6\",\"type\":\"string\" },'\
      '                {\"name\":\"info_7\",\"type\":\"string\" },'\
      '                {\"name\":\"info_8\",\"type\":\"string\" },'\
      '                {\"name\":\"info_9\",\"type\":\"string\" },'\
      '                {\"name\":\"info_0\",\"type\":\"string\" }]}"}'
      schemaTestout='{"schema":'\
      '  "{\"type\":\"record\",'\
      '    \"name\":\"testout\",'\
      '    \"fields\":['\
      '                {\"name\":\"testout_date\",\"type\":\"string\" },'\
      '                {\"name\":\"testout_time\",\"type\":\"string\" },'\
      '                {\"name\":\"testout_name\",\"type\":\"string\" },'\
      '                {\"name\":\"testout_address\",\"type\":\"string\" },'\
      '                {\"name\":\"testout_country\",\"type\":\"string\" },'\
      '                {\"name\":\"testout_info_6\",\"type\":\"string\" },'\
      '                {\"name\":\"testout_info_7\",\"type\":\"string\" },'\
      '                {\"name\":\"testout_info_8\",\"type\":\"string\" },'\
      '                {\"name\":\"testout_info_9\",\"type\":\"string\" },'\
      '                {\"name\":\"testout_info_0\",\"type\":\"string\" }]}"}'
      ```

   1. Via a shell command, register new schemas to the schema registry server

      ```
      # register 'testout' schema
      curl -X POST http://localhost:8081/subjects/schemaTestout/versions \
          -H "Content-Type: application/vnd.schemaregistry.v1+json" \
          --data "${schemaTestout}" 
   
      # register 'test' schema 
      curl -X POST http://localhost:8081/subjects/schemaTest/versions \
          -H "Content-Type: application/vnd.schemaregistry.v1+json" \
          --data "${schemaTest}" 
      ```

   1. Retrieve registered schemas from registry

      ```
      # retrive schema: schemaTest with the latest version
      curl -X GET -i http://localhost:8081/subjects/schemaTest/versions/latest
      
      # retrive schema: schemaTestout with the latest version
      curl -X GET -i http://localhost:8081/subjects/schemaTestout/versions/latest
      ```

## Kafka and Schema registry integration via Java 

The purpose of schema registry is to automatically check/encode/decode schema while producing or consuming messages from Kafka stream. In particular, we will **NOT** send a byte string (which encodes an actual Avro message) when we send Avro message to a Kafka stream. Instread we send directly a Avro message contain both schema and actual data. Similarly, when consuming a Avro message from a Kafka stream, we will consume directly the Avro message which is decoded by Schema registry and there is no need to do the decoding in the actual code. The encoding in producer and decoding in consumer are both automatical and hidden from user.

1. Producer code 

   1. The complete producer code that reads messages from a CSV file and sends Avro messages to a stream while acknowledging schema registry can be checked from [Code Repository](https://github.com/hongyusu/bigdata_etl/blob/master/streaming/src/main/java/streaming/KafkaRegistrySerializer.java).

   1. The key here is to add key and value serializer configuration in Kafka producer configuration as the following Java code


      ```java
      props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,io.confluent.kafka.serializers.KafkaAvroSerializer.class);
      props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,io.confluent.kafka.serializers.KafkaAvroSerializer.class);
      ```

      which will make sure Avro messages when being sent will be properly encoded and serialized.


   1. The actual producer code is rather straight forward as the following Java code


      ```java
      for (int i = 0; i < line.length; i++){
          avroRecord.put(i,line[i]);
      }
      ProducerRecord record = new ProducerRecord<Object, Object>(topic, "key", avroRecord);
      try{
          producer.send(record, new KafkaRegistrySerializerCallback("", messageCount, startTime));
      }catch(SerializationException ex){
      }
      ```

      which will prepare a Avro message and send via a simple Kafka producer. 

   1. If you are checking the schema registry server while running this code, you will notice there are rest calls to the server which will register the schema to the registry server.

1. Consumer code

   The consumer code will initialize a Spark-Streaming conumser which reads from the Avro stream as produced above and processes the message inside the Spark Stream. In particular, this spark consumer will read directly Avro message the decoding is automatic through schema registry server. This approach is quite different from the previous case where we read byte message and decode into Avro. The full code can be found from [Code Repository](https://github.com/hongyusu/bigdata_etl/blob/master/streaming/src/main/java/streaming/SparkRegistrySerializer.java).

   1. The key is to define a proper Kafka stream inside the Spark streaming as in the following Java code

      ```java
      kafkaMSG = KafkaUtils.createStream(
              jssc,
              String.class, 
              GenericRecord.class, 
              StringDecoder.class, 
              KafkaAvroDecoder.class, 
              kafkaParams, 
              topicMap,
              StorageLevel.MEMORY_AND_DISK_SER());
      ``` 

      in which the value type field is _GenericRecord.clas_ and decode class is _KafkaAvroDecoder.class_.

   1. Then where is a Spark Stream mapping function generating the actual Avro message out from the key-value pair as follows

      ```java 
      JavaDStream<GenericRecord> avroInMSG = kafkaMSG.map(
              new Function<Tuple2<String, GenericRecord>,GenericRecord >(){
                  @Override
                  public GenericRecord call(Tuple2<String, GenericRecord> tuple2) throws Exception{
                      return tuple2._2();
                  }
              });
      ``` 

# Conclusion

We have been discussing briefly the integration of Kafka Streaming, Spark Streaming, and Schema Registry Server. The goal is to be able to produce and consumer Avro message from/to Kafka streaming and Spark streaming in a native way. Code examples in Java are provided as in [Code Repository](https://github.com/hongyusu/bigdata_etl/tree/master/streaming).
      

    





