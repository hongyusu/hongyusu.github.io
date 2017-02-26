---
layout: amt-post 
title: "Streaming processing (II): Best Kafka Practice"
location: Helsinki
tags: [Streaming]
---

In the previous article, I briefly discussed the basic setup and integration of Spark Streaming, Kafka, Confluent Schema Registry, and Avro for streaming data processing. My focus here is to demonstrate the best practices when it comes to applying these streaming processing technologies. In particular, I will illustrate a few common KStream operations (e.g., **ValueMapper**, **KeyValueMapper**, **ValueJoiner**, **Predicate**), serialization and deserialization, and unit test for Kafka streaming processing. 

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
   | schemaregistry     | 3.1.2    | git@github.com:hongyusu/schema-registry    |


1. They can be compiled and built via

   maven
   
   ```shell
   mvn package -Dmaven.test.skip=true
   ```
   
   or gradle 
   
   ```shell
   gradle build -x test
   ```

# Kafka

1. As an overview, what I am trying to achieve in this Kafka KStream processing is
   -  **Read** streaming data from two KStream of format `<String, byte[]>`. 
   -  **Read** schame definitions from schema registry if available, otherwise **read** schema definition from a JSON string and register the schema registration server.
   -  **Parse** two KStream with the schema definition and generate two KStream of format `<String, GenericRecord>.`
   -  **Perform** a collection of KStream operations, e.g. value transformation, filtering, repartition, group, reduce to these KStreams.
   -  **Construct** a KTable of format `<String, GenericRecord>` out from one stream.
   -  **Join** the other KStream `<String, GenericRecord>`with this KTable `<String, GenericRecord>`. 
   -  **Branch** the joint KStream to generate two output KStream of format `<String, GenericRecord>`.
   
1. All KStream operations will be implemented as a separate class to make a clean code. As an alternative, one can always write these operations as nested function calls.


## Implemetion

Github is still a good place for code base. In particular, Kafka part can be found from [my Github][kafkapackage]. 

1. Kafka properties

   Properties need to be initialized where in particular we need kafka bootstrap server URL and schema registry server URL

   ```java
    Properties props = new Properties();
    props.put("schema.registry.url", registryURL  );
    props.put("bootstrap.servers",   bootstrapURL );   
    props.put("application.id",      "Kafka-application" + stamp );
    props.put(StreamsConfig.KEY_SERDE_CLASS_CONFIG,   Serdes.String().getClass().getName() );
   ```

1. Avro serdes 
   
   There are a few serdes in order to serialize and deserialize data during transfer. In addition to the string serde and byte array serde, we need Avro serde to deal with streams of GenericRecord defined as 

   ```java
    Serializer serializer     = new KafkaAvroSerializer();
    Deserializer deserializer = new KafkaAvroDeserializer();
    serializer.configure(props,false);
    deserializer.configure(props,false);
    avroSerde   = Serdes.serdeFrom(serializer, deserializer);
   ```

1. Schema registry

   Input KStream is in `<String, byte[]>` format where I need to parse from unstructured data in byte array `byte[]` to structured data `GenericRecord`. Schema definiton is required for the parsering operation. In particular, given a schema name, we need to query schema registry server to retrieve schema from the server, otherwise, register a new schema to the server. For example, the following code deals with schema with name **loguser**
   
   ```java
    int schemaId;
    Schema.Parser parser  = new Schema.Parser();
    CachedSchemaRegistryClient client = new CachedSchemaRegistryClient(props.get("schema.registry.url").toString(),20);
    Schema schema_loguser; 
    try{
        schemaId       = client.getLatestSchemaMetadata("loguser").getId();
        schema_loguser = client.getByID(schemaId);
    }catch (Exception ex){
        schema_loguser = parser.parse(SchemaDef.AVRO_SCHEMA_loguser);
        try{
            schemaId = client.register("loguser",schema_loguser);
        }catch(Exception e){
        }
    }
   ```

1. Define KStream

   Definition of two input KStream in `<String, byte[]>`

   ```java
    KStreamBuilder builder = new KStreamBuilder();
    KStream<String, byte[]> source_loguser   = builder.stream(topicIn_loguser);
    KStream<String, byte[]> source_logaction = builder.stream(topicIn_logaction);
   ```

1. **Perform** a collection of KStream operation on input KStream

   The following codes will perform a collection of map-reduce operations on input KStream including **ValueMapper**, **Predicate**, **KeyValueMapper** which will be demonstrated later. In particular, we implemented these operations as a separate class to make a clean code. Note that there is a **KeyValueMapper** operation which does transformation on key-value pairs. The change of key will require a **through** operation to repartition the message to Kafka brokers. Avro serde is applied to make sure `GenericRecord` can be successfully serialized and deserialized.

   ```java 
    // <KStream> loguser
    KStream<String, GenericRecord> avroIn_loguser = source_loguser
        .mapValues( new GenerateAvroFromByte(schema_loguser) )
        .mapValues( new Processloguser() )
        .filter( new Filterloguser() )
        .map( new RepartitionViaColumn("loguser_id") )
        .through(stringSerde, avroSerde, "loguser-user");
   ``` 

   - Implement **ValueMapper** as a separate class

     *Processloguser* is a instantiation of **ValueMapper** in which **apply()** function needs to be implemented 

     ```java
     public class Processloguser implements ValueMapper<GenericRecord,GenericRecord>{
         public Processloguser() throws Exception{
         }
     	 @Override
     	 public GenericRecord apply(GenericRecord avroMSG){
             try{
                 avroMSG.put("loguser_id",avroMSG.get("loguser_id").toString().substring(2));
             }catch(Exception ex){
             }
             return avroMSG;
     	 }
     }
     ```

   - Implement **Predicate** as a separate class

     *Filterloguser* is an instantiation of **Predicate** in which **test()** function needs to be implemented      

     ```java
     public class Filterloguser implements Predicate<String,GenericRecord>{
     	@Override
     	public boolean test(String key, GenericRecord avroMSG){
             //return avroMSG.get("loguser_id").equals("someid");
             return true;
     	}
     }
     ```

   - Implement **map** as a separate class
 
     *RepartitionViaColumn* is an instantiation of **KeyValueMapper** in which **apply()** function needs to be implemented

     ```java
     public class RepartitionViaColumn implements KeyValueMapper<String,GenericRecord,KeyValue<String,GenericRecord>>{
        private String fieldname;
     	public RepartitionViaColumn(String fieldname) throws Exception{
             this.fieldname = fieldname; 
         }
     	   
     	@Override
     	public KeyValue<String, GenericRecord> apply(String key, GenericRecord value){
             return new KeyValue<>(value.get(fieldname).toString().replaceAll(" ",""),value);
     	}
     }
     ```

   - In particular, if one needs to pass extra variables to KStream operations, a construction function is then required to override the original construction function which takes no input variables.


1. Similar KStream operations are performed on the other input KStream but generate a KTable

   ```java
   // <KTable> logaction
   KTable<String,GenericRecord> KT_logaction_cus = source_logaction
       .mapValues( new GenerateAvroFromByte(schema_logaction) )
       .mapValues( new Processlogaction() )
       .filter( new Filterlogaction() )
       .map( new RepartitionViaColumn("logaction_id") )
       .through(stringSerde, avroSerde, "logaction-user")
       .groupByKey(stringSerde, avroSerde)
       .reduce( new Reducer<GenericRecord>(){
           @Override
           public GenericRecord apply(GenericRecord avro1,GenericRecord avro2){
               return avro1;
           }
       },"KT-logaction-user");
   ```  

   Note Avro serde is applied in many places to make sure KStream/KTable containing `GenericRecord` can be properly serialized and deserialized.

1. Join KStream with KTable 

   ```java
   // JOIN : <KStream>loguser + <KTable>logaction
   KStream<String, GenericRecord> loguser_logaction = avroIn_loguser.leftJoin(KT_logaction_cus,
           new CustomerJoiner(schema_OUTLog));
   ```  

   - Implement **ValueJoiner** 

     *CustomerJoiner* is an instantiation of **ValueJoiner** in which an **apply()** need to be implemented

     ```java
     public class CustomerJoiner implements ValueJoiner<GenericRecord, GenericRecord, GenericRecord> {
         private Schema schema;
         private String[] rfields;
         private String[] lfields;
         public CustomerJoiner(Schema schema) {
             this.schema = schema;
             rfields = null;
             lfields = null;
         }
         public CustomerJoiner(Schema schema, String leftFields, String rightFields) {
             this.schema = schema;
             lfields = leftFields.split(",");
             rfields = rightFields.split(",");
         }
         @Override
         public GenericRecord apply(GenericRecord left, GenericRecord right) {
             GenericRecord output = new GenericData.Record(this.schema);
             Object value = null;
             for (Schema.Field field : this.schema.getFields()) {
                 String name     = field.name();
                 String src_name = name;
                 if(left != null){
                 	value = left.get(src_name); // get returns null if field not found in schema
                 }
                 if(right != null){
                 	value = value == null ? right.get(src_name) : value;
                 }
                 value = value == null ? "" : value;
                 output.put(name, value);
             }
             return output;
         }
     }
     ```

   - KStream joins KStream

     A slight modification will implement a function of KStream joining KStream. The following code will join two KStream within 1s time window.

     ```java
     // JOIN : <KStream>loguser + <KStream>logaction
     KStream<String, GenericRecord> loguser_logaction = avroIn_loguser.leftJoin(KS_logaction_cus,
             new CustomerJoiner(schema_OUTLog),
             JoinWindows.of(1000),
             stringSerde, avroSerde, avroSerde);
     ```  

1. Then joint KStream will be branched into two KStreams and send to output topics. Please refer to the last few lines in [KafkaETLMain.java][kafkamain] 

## Unit test 

1. Dependencies

   There are quite a few super good unit test templates from Kafka package. The following three packages need to be added to the [gradle build file][kafkabuild].

   ```shell
   testCompile group: 'junit', name: 'junit', version: '4.11'
   testCompile files( '/Users/hongyusu/Codes/Packages/kafka/streams/build/libs/kafka-streams-0.10.1.0-test.jar')
   testCompile files( '/Users/hongyusu/Codes/Packages/kafka/streams/build/libs/kafka-streams-0.10.1.0-sources.jar')
   ```

1. Test `ValueMapper` operation

   - For complete code, refer to [ProcessloguserTest.java][kafkatestvaluemapper].

   - Prepare a list of `GenericRecord` as input and another list of `GenericRecord` as expected output. For example, we are testing *Processloguser()* which does a processing on one input field, therefore, we just modify that particular field of input data and use as expected output data.

     ```java
        // MSG
        GenericRecord [] msgIn  = new GenericRecord[TestDataLoguser.size];
        GenericRecord [] msgOut = new GenericRecord[TestDataLoguser.size];
        for(int k = 0; k < TestDataLoguser.lines.length; k++){
            msgIn[k]  = new GenericData.Record(schema_loguser);
            msgOut[k] = new GenericData.Record(schema_loguser);
            String[] fields = TestDataLoguser.lines[0].split(",",-1); 
            try{
                for (int i = 0; i < fields.length; i++){
                    if (fields[i] == null){
                        msgIn[k].put(i,"");
                        msgOut[k].put(i,"");
                    }else{
                        msgIn[k].put(i,fields[i]);
                        msgOut[k].put(i,fields[i]);
                    }
                }
            }catch(Exception ex){
            }
            msgOut[k].put("loguser_id",msgOut[k].get("loguser_id").toString().substring(2));
        }
     ``` 

   - Process input data and get output data 

     ```java
        // STREAM DEFINITION
        KStream<String, GenericRecord> stream;
        MockProcessorSupplier<String, GenericRecord> processor = new MockProcessorSupplier<>();
        stream = builder.stream(stringSerde, avroSerde, topicName);
        stream.mapValues(new Processloguser()).process(processor);
        // DRIVER 
        driver = new KStreamTestDriver(builder);
        // PROCESS DATA
        for (int i = 0; i < TestDataLoguser.size; i++) {
            driver.process(topicName, "key", msgIn[i]);
        }
     ```

   - Use assertion to evalue the output againt the expected output. 

     ```java
        // TEST SIZE
        assertEquals(TestDataLoguser.size, processor.processed.size());
        // TEST RESULT
        for (int i = 0; i < TestDataLoguser.size; i++) {
            assertEquals("key:"+msgOut[i].toString(), processor.processed.get(i));
        }
     ```

1. Test `KeyValueMapper` operation

   - For complete code, refer to [RepartitionViaColumnTest.java][kafkatestkeyvaluemapper].

   - Prepare input data in a similar way as testing `ValueMapper` in which a list of input and another list of expected output need to be defined.

   - Setup the test such that the input KStream will go through the `KeyValueMapper` operation which in this case is _RepartitionViaColumn.java_ function. The key of the input KStream will be altered.

     ```java
        // STREAM DEFINITION
        KStream<String, GenericRecord> stream;
        MockProcessorSupplier<String, GenericRecord> processor = new MockProcessorSupplier<>();
        stream = builder.stream(stringSerde, avroSerde, topicName);
        try{
            stream.map( new RepartitionViaColumn("loguser_id") ).process(processor);
        }catch(Exception ex){
        }
        // DRIVER 
        driver = new KStreamTestDriver(builder);
        // PROCESS DATA
        for (int i = 0; i < TestDataLoguser.size; i++) {
            driver.process(topicName, "key", msgIn[i]);
        }
     ```

   - User Java unit test assertion to evalue the expected output and the real output

     ```java
        // TEST SIZE
        assertEquals(TestDataLoguser.size, processor.processed.size());
        // TEST RESULT
        for (int i = 0; i < TestDataLoguser.size; i++) {
            assertEquals(msgOut[i].get("loguser_CUSTOMER_ID").toString()+":"+msgOut[i].toString(), processor.processed.get(i));
        }
     ``` 

 

1. Test `Predicate` operation  

   - For complete code, refer to [FilterloguserForPCTest.java][kafkatestpredicate].

   - Prepare input data in a similar way as testing `ValueMapper`. 

   - Setup the test such that one input KStream will be branched into two KStreams via `branch()` and `Predicte` functions under test. 
  
     ```java
        KStream<String, GenericRecord> stream;
        KStream<String, GenericRecord> [] branches;
        MockProcessorSupplier<String, GenericRecord>[] processors;
        stream = builder.stream(stringSerde, avroSerde, topicName);
        branches = stream.branch( new FilterloguserForPC("P"), new FilterloguserForPC("C") );
        assertEquals(2, branches.length);
        processors = (MockProcessorSupplier<String, GenericRecord>[]) Array.newInstance(MockProcessorSupplier.class, branches.length);
        for (int i = 0; i < branches.length; i++) {
            processors[i] = new MockProcessorSupplier<>();
            branches[i].process(processors[i]);
        }
        // DRIVER
        driver = new KStreamTestDriver(builder);
        // TEST
        for (int i = 0; i < TestDataLoguser.size; i++) {
            driver.process(topicName, "key", msgIn[i]);
     ```
   
   - User java unit assertion to evalute the number of messages comming out from each branched KStreams

     ```java
        assertEquals(23, processors[0].processed.size());
        assertEquals(5, processors[1].processed.size());
     ```
      

# Others

  Other  related topics will be introduced in some separate articles in the near future including:

  1. Kafka connector to JDBC, HDFS, HBASE
  1. Integration of Kafka towards Flume

# Conclusion

I walk through some _best_ practices when apply Kafka to streaming processing using mostly KStream including some implementation and unit testing cases as well. Examples are mostly about KStream operations, e.g. `ValueMapper`, `Predicate`, `KeyValueMapper`. Following these example, one should be able to process Kafka stream of GenericRecord (Avro) in a more efficient way. 



    

[kafkapackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_kafka
[kafkabuild]:   https://github.com/hongyusu/bigdata_etl/blob/master/etl_kafka/build.gradle
[kafkamain]:    https://github.com/hongyusu/bigdata_etl/blob/master/etl_kafka/src/main/java/etl_kafka/KafkaETLMain.java
[kafkatestvaluemapper]:       https://github.com/hongyusu/bigdata_etl/blob/master/etl_kafka/src/test/java/etl_kafka/ProcessloguserTest.java
[kafkatestkeyvaluemapper]:    https://github.com/hongyusu/bigdata_etl/blob/master/etl_kafka/src/test/java/etl_kafka/RepartitionViaColumnTest.java
[kafkatestpredicate]:         https://github.com/hongyusu/bigdata_etl/blob/master/etl_kafka/src/test/java/etl_kafka/FilterloguserForPCTestt.java
[sparkpackage]: https://github.com/hongyusu/bigdata_etl/tree/master/etl_spark
[sparkbuild]:   https://github.com/hongyusu/bigdata_etl/blob/master/etl_spark/build.gradle




