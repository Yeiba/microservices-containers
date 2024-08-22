import { Kafka } from "kafkajs";

const brokers = ["kafka:29092", "kafka:29092", "kafka:29092"];

const kafka = new Kafka({
    clientId: "user-app",
    brokers,
});

const topics = ["users", "user-created", "user-updated", "user-deleted"];

const consumer = kafka.consumer({
    "groupId": "user-service",
});

function messageCreatedHandler(data) {
    console.log("Got a new message", JSON.stringify(data, null, 2));
}

const topicToSubscribe = {
    "Users": messageCreatedHandler,
};

export async function connectConsumer() {
    await consumer.connect();
    console.log("Connected to consumer");

    for (let i = 0; i < topics.length; i++) {
        await consumer.subscribe({
            topic: topics[i],
            fromBeginning: true,
        });
    }

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (!message || !message.value) {
                return;
            }
            const data = JSON.parse(message.value.toString());
            const handler = topicToSubscribe[topic];

            if (handler) {
                handler(data);
            }
        },
    });
}

export async function disconnectConsumer() {
    await consumer.disconnect();
    console.log("Disconnected from consumer");
}