Explanation
    SparkSession: The entry point to programming Spark with the Dataset and DataFrame API.
    Configuration: You need to configure the MongoDB URI, database, collection, Elasticsearch nodes, and index.
    Read data from MongoDB: Using the MongoDB connector, read data from the specified MongoDB collection.
    Write data to Elasticsearch: Using the Elasticsearch connector, write the data to the specified Elasticsearch index.
Additional Notes
    Make sure the spark.mongodb.input.uri and spark.mongodb.input.database configurations are correctly set to point to your MongoDB instance.
    Ensure that the Elasticsearch connector is compatible with your version of Spark. You can check the compatibility on the Elasticsearch-Hadoop GitHub repository.
    You might need to adjust the configurations to suit your specific environment and data requirements.

