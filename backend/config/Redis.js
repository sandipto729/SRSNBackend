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

module.exports = RedisClient;