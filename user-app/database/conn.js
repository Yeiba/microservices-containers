import mongoose from "mongoose";
import Redis from 'ioredis'
import redis from 'redis'
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from 'dotenv';
dotenv.config()

const AWS = require('aws-sdk');
import config from '../config.js';



// Multer S3 Configuration
async function s3Bucket() {
    // AWS S3 Configuration
    AWS.config.update({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        region: config.AWS_REGION
    });
    try {
        const s3 = await new AWS.S3();
        return s3
    } catch (error) {
        console.log('we might not be as connected to s3_Bucket', error)
    }
}


async function connect() {
    // const mongod = await MongoMemoryServer.create();
    // const getUri = mongod.getUri();
    // mongoose.Promise = Promise
    // mongoose.set('strictQuery', true)
    // const db = await mongoose.connect(getUri);
    try {
        const mongoURL = 'mongodb://mongo_one:27017,mongo_two:27017,mongo_three:27017/'
        const db = await mongoose.connect(mongoURL)
            .then(() => console.log('MongoDB app database connected...'))
            .catch(err => {
                console.log('we might not be as connected as I thought')
                console.log(err)
            })

        return db;
    } catch (error) {
        console.log('we might not be as connected to db', error)
    }


}

async function cachRedisClient() {
    try {
        // const client = redis.createClient({ url: "redis://redis_one:6379", });
        const client = new Redis({ port: 6379, host: "redis_one" });
        client.on("error", (err) => console.log("Redis Cach Client Connection Error"));
        // await client.connect();
        console.log("Redis cashe app database connected...");
        return client;
    } catch (error) {
        console.log('Redis cash app connection Error...', error);
    }
}
async function sessionRedisClient() {
    try {
        // const client = redis.createClient({ url: "redis://redis_one:6379", });
        const client = new Redis({ port: 6379, host: "redis_two" });
        client.on("error", (err) => console.log("Redis Session Client Connection Error"));
        // await client.connect();
        console.log("Redis Session app database connected...");
        return client;
    } catch (error) {
        console.log('Redis Session app connection Error...', error);
    }
}

async function redisSearchClient() {
    try {
        // const client = redis.createClient({ url: "redis://redis_one:6379", });
        const client = new Redis({ port: 6379, host: "redis_three" });
        client.on("error", (err) => console.log("Redis Session Client Connection Error"));
        // await client.connect();
        console.log("rediSearch app database connected...");
        return client;
    } catch (error) {
        console.log('rediSearch app connection Error...', error);
    }
}

export { connect, cachRedisClient, sessionRedisClient, redisSearchClient, s3Bucket };