const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();
const { createClient } = require('redis');

// Initialize Redis client
const RedisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
});

RedisClient.on('error', (err) => console.error('Redis error:', err));

// Connect to Redis
(async () => {
    try {
        await RedisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();
const IORedis = require('ioredis');

// IORedis connection for BullMQ and queue services
const redisConnection = new IORedis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
});

redisConnection.on('error', (err) => console.error('IORedis error:', err));

RedisClient.redisConnection = redisConnection;
RedisClient.ioRedis = redisConnection;

module.exports = RedisClient;
module.exports.redisConnection = redisConnection;
module.exports.ioRedis = redisConnection;
module.exports.RedisClient = RedisClient;