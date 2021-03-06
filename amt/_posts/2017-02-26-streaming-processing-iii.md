---
layout: amt-post 
title: "Streaming processing (III): Best Spark Practice"
location: Helsinki
tags: [Streaming]
---

Previous article illustrates some experience when applying Kafka on processing streaming data which is an extension of early article discussing the basic concept, setup, and integration of Kafka, Spark stream, Confluent Schema Registry, and Avro for streaming data processing. This post will devote to some best practices on Spark Streaming operations (e.g., **transform**, **Broadcast Variables**), serialization and deserialization, and unit test for Spark streaming processing. 

# Related articles

1. [Streaming processing (III): Best Spark Practice](/amt/streaming-processing-iii.html)
1. [Streaming processing (II):  Best Kafka Practice](/amt/streaming-processing-ii.html)
1. [Streaming processing (I):   Kafka, Spark, Avro Integration](/amt/spark-streaming-kafka-avro-and-registry.html)

# Table of content
* auto-gen TOC:
{:toc}

# Package and versions

1. The following packages need to be prepared.

   | Packages           | Version  | Repository                                 |
   |:-------------------|---------:|-------------------------------------------:|
   | mvn                | 3.3.9    |                                            | 
   | gradle             | 3.3      |                                            |
   | kafka              | 0.10.1.0 | git@github.com:hongyusu/kafka.git          |
   | flume              | 1.8.0    | git@github.com:hongyusu/flume.git          |
   | spark              | 1.6.2    | git@github.com:hongyusu/spark.git          |
   | schemaregistry     | 3.1.2    | git@github.com:hongyusu/schema-registry    |


1. They can be compiled and built via

   - maven
     
     ```shell
     mvn package -Dmaven.test.skip=true
     ```
   
   - gradle 
     
     ```shell
     gradle build -x test
     ```

# Spark Stream

1. On a conceptual level, the following Spark Stream example will

   - **Read** data stream from a Kafka topic. The stream will be in *binary* or *byte array* format before deserialization and decoding. 
   - **Deserialize** and **decode** the stream using *kryo* class.
   - **Generate** a stream of *RDD* of `GenericRecord`.
   - **Process** this *RDD* stream with *transform* operation.
   - **Generate** and **serialize** an output Kafka stream of `<String, GenericRecord>` using Kafka producer. 

1. All Spark Stream operations will be implemented as a separate class to make a clean code. As an alternative, one can always write these operations as nested function calls.

## Implementation

Github is still a good place for code base. In particular, Kafka part can be found from [my Github][sparkpackage]. 

1. Spark configuration with *kryo* as deserializer.
As data to be received is generated by the Kafka streaming processing steps described in the previous articles which are essentially a stream of `<String, GenericRecord>`. 
As a result, *kryo* is required in Spark to make deserialization happen.

   ```java
   SparkConf sparkConf = new SparkConf()
       .setAppName("Spark-Processor")
       .setMaster("local[2]")
       .registerKryoClasses(
               new Class<?>[]{
                   Class.forName("org.apache.avro.generic.GenericData"),
               });
   ```

1. Add parameters to property variables.
In particular, _zookkeeper url_ and _registry url_ need to be specified. 

   ```java
   Map<String, String> kafkaParams = new HashMap<>();
   kafkaParams.put("zookeeper.connect", zookeeperURL);
   kafkaParams.put("schema.registry.url", registryURL);
   kafkaParams.put("group.id", groupName);

   Properties props = new Properties();
   props.put("bootstrap.servers", bootstrapURL);
   props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
   props.put("value.serializer", "org.apache.kafka.common.serialization.ByteArraySerializer");
   ```

1. Receive a stream of `RDD<String, GenericRecord>` from Kafka stream.

   ```java
   // TODO: DIRECT KAFKA STREAM
   JavaStreamingContext jssc = new JavaStreamingContext(sparkConf, Durations.seconds(batchSize));
   // INPUT TOPIC
   Map<String, Integer> topicMap = new HashMap<>();
   for (String topic : topicIn.split(",")) {
       topicMap.put(topic, numThreads);
   }
   // create key-value stream
   JavaPairReceiverInputDStream<String, GenericRecord> streamMsg = KafkaUtils.createStream(
           jssc,
           String.class, 
           GenericRecord.class, 
           StringDecoder.class, 
           KafkaAvroDecoder.class, 
           kafkaParams, 
           topicMap,
           StorageLevel.MEMORY_AND_DISK_SER());
   ``` 

1. Convert the input stream from `RDD<String, GenericRecord>` to `RDD<GenericRecord>`.
A Spark mapper is needed to map from `tuple<key,value>` to `tuple<value>`.

   ```java
   // get record stream
   JavaDStream<GenericRecord> avroInMsg = streamMsg.map(
           new Function<Tuple2<String, GenericRecord>,GenericRecord >(){
               @Override
               public GenericRecord call(Tuple2<String, GenericRecord> tuple2) throws Exception{
                   return tuple2._2();
               }
           });
   ```

1. Process the stream of `RDD<GenericRecord>` and generate output Kafka stream of `<String, GenericRecord>`.

   ```java
   if (operation == ProcessloguserP)       {
       avroOutMsg = avroInMsg.transform( new ProcessLogToP() );
       avroOutMsg.foreachRDD( new ProduceOutputStream(topicOut, schemaNameOut, producerP) );
   } else if (operation == ProcessloguserC)       {
       avroOutMsg = avroInMsg.transform( new ProcessLogToC() );
       avroOutMsg.foreachRDD( new ProduceOutputStream(topicOut, schemaNameOut, producerC) );

   }
   ```

   - Implement Spark transformation operation


     ```java
     public class ProcessLogToP implements Function<JavaRDD<GenericRecord>, JavaRDD<GenericRecord>> {
         private static final long serialVersionUID = 1L;
         @Override
         public JavaRDD<GenericRecord> call(JavaRDD<GenericRecord> rddIn) throws Exception{
             final Broadcast<Map<String,Schema>> schemaList = BCVariables.getInstance(new JavaSparkContext(rddIn.context()));
             JavaRDD<GenericRecord> rddOut = rddIn.map(
                     new Function<GenericRecord, GenericRecord>(){
                         @Override
                         public GenericRecord call (GenericRecord input) throws Exception{
                         	Schema schema = schemaList.value().get("P");
                             GenericData.Record output = new GenericData.Record(schema);
                             for (Schema.Field field : schema.getFields()) {
                             	output.put(field.name(),"");
                             }
                             output.put("C1","ABC");
                             return output;             
                         }
                     }); 
             return rddOut;
         }
     }
     ```

   - Generate Kafka stream of `<String, GenericRecord>`. We use Twitter's *Bijection* package. We can also use Avro Serde to serialize the message directly. 

     ```java
     public class ProduceOutputStream implements Function2<JavaRDD<GenericRecord>, Time, Void> {
         private String topicOut;
         private String schemaNameOut; 
         private KafkaProducer<String, byte[]> producer;
         public ProduceOutputStream(String topicOut, String schemaNameOut, KafkaProducer<String, byte[]> producer){
             this.topicOut      = topicOut;
             this.schemaNameOut = schemaNameOut;
             this.producer      = producer;
         }
         public Void call(JavaRDD<GenericRecord> rdd, Time time) throws Exception{
             long startTime = 0;
             byte[] bytes   = null;
             ProducerRecord<String, byte[]> data = null;
             List<GenericRecord> records = null;
             Broadcast<Map<String,Schema>> schemaList = BCVariables.getInstance(new JavaSparkContext(rdd.context()));
             Injection<GenericRecord, byte[]> outInjection = GenericAvroCodecs.toBinary(schemaList.value().get(schemaNameOut));
             if (rdd != null){
                 records = rdd.collect();
                 for (GenericRecord record : records){
                     bytes = outInjection.apply(record);
                     data = new ProducerRecord<>(topicOut, bytes);
                     startTime = System.currentTimeMillis();
                     producer.send(data, new KafkaProducerCallback(startTime));
                 }
                 System.out.println("----- Message processed: " + rdd.count());
             }
             return null;
         }
     }
     ```

   - Variables should be passed to each mapper using the *Broadcast* principle. In particular, schema definition is passed to mappers, therefore, we should use *CachedSchemaRegistryClient* to contact and register schema to Registry server when applicable. 
     

     ```java
     public class BCVariables{
         private static volatile Broadcast<Map<String,Schema>> instance = null;
         public static Broadcast<Map<String,Schema>> getInstance(JavaSparkContext jsc){
             Map<String, Schema> ficoSchemaList = new HashMap<>(); 
             int schemaId;
             String registryURL   = "http://localhost:8081";
             Schema.Parser parser = new Schema.Parser();
             CachedSchemaRegistryClient client = new CachedSchemaRegistryClient(registryURL,20);
             if(instance == null){
                 synchronized (BCVariables.class){
                     if (instance == null){
                         Schema SchemaP     = null;
                         Schema SchemaC     = null;
                         try{
                             schemaId = client.getLatestSchemaMetadata("P").getId();
                             SchemaP = client.getByID(schemaId);
                         }catch (Exception ex){
                             SchemaP     = parser.parse(SchemaDef.AVRO_SCHEMA_P   );
                             try{
                                 schemaId = client.register("P",SchemaP);
                             }catch(Exception e){
                             }
                         }
                         try{
                             schemaId = client.getLatestSchemaMetadata("C").getId();
                             SchemaC = client.getByID(schemaId);
                         }catch (Exception ex){
                             SchemaC     = parser.parse(SchemaDef.AVRO_SCHEMA_C   );
                             try{
                                 schemaId = client.register("C",SchemaC);
                             }catch(Exception e){
                             }
                         }
                         ficoSchemaList.put("P",    SchemaP);
                         ficoSchemaList.put("C",    SchemaC);
                         instance = jsc.broadcast(ficoSchemaList);
                     }
                 }
             }
             return instance;
         }
     }
     ```


## Unit test

The example is based on running a unit test for Spark Stream **transform** operation. Other operation can be tested in the similar fashion.

1. Setup test by defining Spark context.
 
   ```java
   @Before
   public void setUp() {
       conf = new SparkConf().setAppName("test").setMaster("local[*]");
       ssc  = new JavaStreamingContext(conf, new Duration(1000L));
   }
   ```

1. Shutdown test properly by closing the Spark context. This will allow running multiple unit test during a test cycle.

   ```java
   @After
   public void tearDown() {
       ssc.close();
   }
   ```
  
1. The actual test illstrated here is nothing more than a template. Actual testing cases still need to be filled.

   - Setup testing cases   

     ```java
     Schema.Parser parser = new Schema.Parser();
     Schema schema = parser.parse(SchemaDef.AVRO_SCHEMA_OUTLog);
     GenericRecord record = new GenericData.Record(schema);
     
     for (Schema.Field field : schema.getFields()) {
         record.put(field.name(), "1");
     }
     
     List<GenericRecord> inputList = new ArrayList<>();
     inputList.add(record);
     Queue<JavaRDD<GenericRecord>> rddQueue = new LinkedList<>();
     JavaDStream<GenericRecord> inputStream = ssc.queueStream(rddQueue);
     ```

   - Execute the operation under test which is *ProcessLogToP()* on the input data just generated and retrive the results. 

     ```java
     JavaDStream<GenericRecord> outputStream = inputStream.transform(new ProcessLogToP());
     ```

   - Compare the actual resules with the expected results using assertion.


# Conclusion

We have discussed some _best_ practices connecting Spark Stream to Kafka KStream, applying Spark Stream operation e.g. **transform**, and sending out Kafka stream out from Spark streams.


    

[kafkapackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_kafka
[kafkabuild]:   https://github.com/hongyusu/bigdata_etl/blob/master/etl_kafka/build.gradle
[kafkamain]:    https://github.com/hongyusu/bigdata_etl/blob/master/etl_kafka/src/main/java/etl_kafka/KafkaETLMain.java
[sparkpackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_spark
[sparkbuild]:   https://github.com/hongyusu/bigdata_etl/blob/master/etl_spark/build.gradle




