import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
    exports: [CacheModule],
    imports: [
        CacheModule.registerAsync({
            inject: [ConfigService],
            isGlobal: true,
            useFactory: async (config: ConfigService) => ({
                store: await redisStore({
                    host: config.get<string>('redis.host'),
                    port: config.get<number>('redis.port'),
                }),
                ttl: config.get<number>('cache.ttl'),
            }),
        }),
    ],
})
export class AppCacheModule {}
