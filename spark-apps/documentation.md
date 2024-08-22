RDD

Transformation:
	narrow :
		map()
		filter()
		flatMap()
        partition()
		mapPartitions()
	wide :
		reduceBy()
		union()

Actions:
	collect()
	count()
	take()
	first()
 

Explanation:
    spark-master: This service runs the Spark master node using the Bitnami Spark image. It exposes the web UI on port 8080 and the Spark master service on port 7077.
    spark-worker-1 and spark-worker-2: These services run Spark worker nodes. They connect to the Spark master at spark://spark-master:7077 and expose their web UIs on ports 8081 and 8082, respectively.
    spark-submit: This service is used to submit a Python program to the Spark cluster. It mounts the ./spark-apps directory to /opt/spark-apps inside the container and runs the spark-submit command to execute your_python_script.py. Replace your_python_script.py with the name of your actual Python script. The service waits until the Spark master is available before submitting the job.
    networks: A custom network (spark-network) is defined to ensure the Spark nodes and the submit service can communicate with each other.
    
Usage
    Create a directory called spark-apps and place your Python script (your_python_script.py) inside it.
    Start the cluster by running:
    docker-compose up -d
    The spark-submit service will automatically submit your Python script to the Spark cluster once the Spark master is available.

This setup allows you to run a Spark application written in Python on a Spark cluster managed by Docker Compose. Adjust the command section in the spark-submit service if you need to pass additional parameters or change the script location.