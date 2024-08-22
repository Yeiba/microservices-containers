import { createRequire } from "module";
const require = createRequire(import.meta.url);
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { connect, cachRedisClient, sessionRedisClient, redisSearchClient } from './database/conn.js';

import router from './router/route.js';
import cookieParser from "cookie-parser";
import { notFoundHandler, errorHandler } from "./middleware/error.js";
import path from "path";
import dotenv from 'dotenv';
dotenv.config()

import { connectProducer, disconnectFromKafka, createUserAppTopics } from "./utils/event-producer/event-producer.js";
import { connectConsumer, disconnectConsumer } from "./utils/event-consumer/event-consumer.js";

import Redis from 'ioredis'
import RedisStore from "connect-redis"
import session from "express-session"

const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
}
const app = express();
// middleware
app.use(cookieParser())
app.enable("trust proxy");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.disable('x-powered-by');

app.use(cors(corsOptions))


//Configure redis client
const redisClient = Redis.createClient({
    host: 'redis_one',
    port: 6379
})
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'session_Token',
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
}));

const port = process.env.PORT || 8080;
// Api Routes
app.use('/api', router)

app.get('/', (req, res) => {
    res.status(201).json("Home get request")
});

app.use(notFoundHandler);
app.use(errorHandler);

// check for databases connections
const mongoConnection = await new Promise((resolve, reject) => {
    connect().then(() => {
        resolve();
    }).catch((err) => {
        reject(new Error(err))
    })
})
const redisCachConnection = await new Promise((resolve, reject) => {
    cachRedisClient().then(() => {
        resolve();
    }).catch((err) => {
        reject(new Error(err))
    })
})
const redisSessionConnection = await new Promise((resolve, reject) => {
    sessionRedisClient().then(() => {
        resolve();
    }).catch((err) => {
        reject(new Error(err))
    })
})
const rediSearchConnection = await new Promise((resolve, reject) => {
    redisSearchClient().then(() => {
        resolve();
    }).catch((err) => {
        reject(new Error(err))
    })
})
const kafkaProducerConnection = await new Promise((resolve, reject) => {
    connectProducer().then(() => {
        resolve();
    }).catch((err) => {
        reject(new Error(err))
    })
})

const createTopics = await new Promise((resolve, reject) => {
    createUserAppTopics().then(() => {

        resolve();
    }).catch((err) => {
        reject(new Error(err))
    })
})

const kafkaConsumerConnection = await new Promise((resolve, reject) => {
    connectConsumer().then(() => {

        resolve();
    }).catch((err) => {
        reject(new Error(err))
    })
})

async function gracefulShutdown(app) {
    console.log("Graceful shutdown");

    await app.close();
    await disconnectFromKafka();
    await disconnectConsumer();
    process.exit(0);
}

// start server only when we have valide connection on mongodb
Promise.all([mongoConnection, redisCachConnection, redisSessionConnection, rediSearchConnection, kafkaProducerConnection, createTopics, kafkaConsumerConnection]).then(() => {
    try {
        app.listen(port, () => {
            console.log(`listening on http://localhost:${port}`)
        });
        const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];

        for (let i = 0; i < signals.length; i++) {
            const signal = signals[i];
            process.on(signal, () => {
                gracefulShutdown(app);
            });
        }
    } catch (error) {
        console.log('cannot connect to the server');
    }
}).catch(error => {
    console.log("Invalid database connection.....!")
    console.log({ error })
});













