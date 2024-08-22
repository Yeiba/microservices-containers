from pyspark.sql import SparkSession
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils
from pyspark.sql.functions import *
from pyspark.sql.types import StructType, StructField, StringType, IntegerType
from elasticsearch import Elasticsearch

# Initialize Spark session
spark = SparkSession.builder \
    .appName("MongoDBToElasticsearch") \
    .config("spark.mongodb.input.uri", "mongodb://mongo_one:27017,mongo_two:27017,mongo_three:27017/admin.users") \
    .config("spark.mongodb.output.uri", "mongodb://mongo_one:27017,mongo_two:27017,mongo_three:27017/admin.users") \
    .getOrCreate()

# Create a streaming context with a batch interval of 10 seconds
ssc = StreamingContext(spark.sparkContext, 10)

# Define Elasticsearch connection
es = Elasticsearch(["http://es01:9200"])
es_index = "users-index"

# Read streaming data from MongoDB (Simulated using Kafka for real-time streaming)
kafkaStream = KafkaUtils.createStream(ssc, "zookeeper:2181", "spark-streaming-consumer", {"users": 1})


# Read data from MongoDB
schema = StructType([
    StructField("_id", StringType(), True),
    StructField("field1", StringType(), True),
    StructField("field2", IntegerType(), True),
    # Add more fields as per your MongoDB collection schema    .schema(schema) \ uncide df
])


def process_rdd(rdd):
    if not rdd.isEmpty():
        df = spark.read.json(rdd)
        transformed_df = df.selectExpr("field1", "field2")  # Adjust fields according to your schema
        df.write \
            .format("org.elasticsearch.spark.sql") \
            .option("es.nodes", "es01") \
            .option("es.port", "9200") \
            .option("es.resource", es_index) \
            .mode("append") \
            .save()

kafkaStream.foreachRDD(lambda rdd: process_rdd(rdd))

# Start the streaming context
ssc.start()
ssc.awaitTermination()

