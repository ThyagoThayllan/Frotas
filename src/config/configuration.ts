export default () => ({
    cache: {
        ttl: parseInt(process.env.CACHE_TTL, 10) || 300,
    },
    database: {
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT, 10) || 1433,
        username: process.env.DB_USERNAME,
    },
    jwt: {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        secret: process.env.JWT_SECRET,
    },
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    },
    seed: {
        userPassword: process.env.SEED_USER_PASSWORD || 'aivacol@2024',
    },
});
