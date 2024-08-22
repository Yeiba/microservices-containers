import { Kafka } from "kafkajs";

const brokers = ["kafka:29092", "kafka:29092", "kafka:29092"];

const kafka = new Kafka({
    clientId: "user-app",
    brokers,
});

export { kafka, brokers }