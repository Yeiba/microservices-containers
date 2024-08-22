To stream data from MongoDB to Elasticsearch using Logstash and filter it to JSON, you can follow these steps:

        Set up MongoDB and Elasticsearch: Ensure you have running MongoDB and Elasticsearch instances.
        Set up Logstash: Ensure you have Logstash installed.
        Configure the Logstash pipeline: Create a configuration file for Logstash to read data from MongoDB, filter it, and write it to Elasticsearch.
Prerequisites
        MongoDB: Ensure you have MongoDB running.
        Elasticsearch: Ensure you have Elasticsearch running.
        Logstash: Ensure you have Logstash installed.
Steps
        Set up the Logstash configuration file
        Run Logstash
1. Set up the Logstash configuration file
Create a Logstash configuration file called logstash.conf and add the following configuration:

input {
  mongodb {
    uri => "mongodb://localhost:27017/your_db_name"
    placeholder_db_dir => "/path/to/logstash-mongodb/"
    placeholder_db_name => "logstash_sqlite.db"
    collection => "your_collection_name"
    batch_size => 5000
    start_timestamp => "2023-01-01T00:00:00.000Z"
  }
}

filter {
  json {
    source => "message"
  }
  mutate {
    remove_field => ["_id"]
  }
}

output {
  elasticsearch {
    hosts => ["http://localhost:9200"]
    index => "your_index_name"
    document_id => "%{_id}"
  }
  stdout {
    codec => rubydebug
  }
}

Configuration Details:
        input.mongodb:

                uri: MongoDB connection URI.
                placeholder_db_dir: Directory to store the SQLite database that tracks the state of the input.
                placeholder_db_name: Name of the SQLite database.
                collection: The MongoDB collection to read from.
                batch_size: The number of documents to fetch in each batch.
                start_timestamp: The starting timestamp to read documents from MongoDB.
        filter:

                json filter: Parses the JSON in the message field. Adjust the field name if necessary.
                mutate filter: Removes the MongoDB _id field if it is not needed in Elasticsearch. You can adjust this to suit your needs.
        output.elasticsearch:

                hosts: Elasticsearch instance URL.
                index: The Elasticsearch index to write to.
                document_id: The document ID field in Elasticsearch, typically the _id field from MongoDB.
        output.stdout:

                Prints the output to the console for debugging purposes using the rubydebug codec.


Explanation
        input:

                The MongoDB input plugin reads data from the specified MongoDB collection. The placeholder_db_dir and placeholder_db_name keep track of the state so that Logstash knows where it left off.
                The start_timestamp specifies the initial timestamp from which to start reading documents.
        filter:

                The json filter parses the JSON data in the specified field.
                The mutate filter can remove the MongoDB _id field if you do not want it in the Elasticsearch index. Adjust the filters as needed to suit your data transformation requirements.
        output:

                The Elasticsearch output plugin writes the data to the specified Elasticsearch index. The document_id ensures that documents are uniquely identified by their MongoDB _id.
                The stdout output prints the transformed data to the console for debugging purposes.
Notes
        Ensure that the MongoDB and Elasticsearch instances are running and accessible from the machine where Logstash is running.
        Adjust the paths, collection names, and other parameters as needed to match your specific environment and requirements.
        Install the required Logstash input plugin for MongoDB. If not installed, you can install it by running the following command:
        logstash-plugin install logstash-input-mongodb


 docker cp es-es01-1:/usr/share/elasticsearch/config/certs/ca/ca.crt ./elk

openssl x509 -fingerprint -sha256 -noout -in ./elk/ca.crt | awk -F"=" {'print $2'} | sed s/://g

9C6A701150270B7CA075CDD41A4BCC60D0D99238595C08124FE3CBF6BC75BE94