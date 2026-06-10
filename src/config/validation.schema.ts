import Joi from 'joi';

export const validationSchema = Joi.object({
    CACHE_TTL: Joi.number().default(300),

    DB_DATABASE: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_PORT: Joi.number().default(1433),
    DB_USERNAME: Joi.string().required(),

    JWT_EXPIRES_IN: Joi.string().default('1d'),
    JWT_SECRET: Joi.string().required(),

    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),

    REDIS_HOST: Joi.string().default('localhost'),
    REDIS_PORT: Joi.number().default(6379),

    SEED_USER_PASSWORD: Joi.string().default('aivacol@2024'),
});
