import { redisSearchClient } from '../database/conn.js'
const client = await redisSearchClient()

export async function setToRediSearch(key, value) {

    await client.set(key, JSON.stringify(value));
}