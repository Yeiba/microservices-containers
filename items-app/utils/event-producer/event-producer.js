import { Kafka } from "kafkajs";

import { connect } from '../../database/conn.js';

const brokers = ["kafka:29092", "kafka:29092", "kafka:29092"];

const kafka = new Kafka({
    clientId: "user-app",
    brokers,
});
const producer = kafka.producer();
const admin = kafka.admin();

export async function createUserAppTopics() {
    const topics = ["users", "user-created", "user-updated", "user-deleted"]
    await admin.connect();
    for (let i = 0; i < topics.length; i++) {
        await admin.createTopics({
            "topics": [{
                "topic": topics[i],
                "numPartitions": 2
            }]
        })
    }
    console.log("User App Topics Successfully created")
}

export async function connectProducer() {
    await producer.connect();
    console.log("Producer connected");
}



export async function disconnectFromKafka() {
    await producer.disconnect();
    await admin.disconnect();
    console.log("Producer disconnected");
}

async function streamUsersCollection() {
    connectProducer()
    try {
        const mongodb = connect()
        const db = mongodb.db("admin");
        const collection = db.collection("users");
        // Watch for changes in the MongoDB collection
        const changeStream = collection.watch();
        changeStream.on('change', async (change) => {
            const doc = change.fullDocument;
            await producer.send({
                topic: "users",
                messages: [
                    { value: JSON.stringify(doc) }
                ]
            });
            console.log('Sent:', doc);
        });

    } catch (error) {
        console.error('Error in producer:', error);
    }
}

streamUsersCollection().catch(console.error);

export async function produceMessage(topic, message) {
    return producer.send({
        topic,
        messages: [{ value: message }],
    });
}