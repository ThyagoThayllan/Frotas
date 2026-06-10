import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                database: config.get('database.database'),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                host: config.get('database.host'),
                logging: config.get('nodeEnv') === 'development',
                migrations: [__dirname + '/migrations/*{.ts,.js}'],
                migrationsRun: false,
                password: config.get('database.password'),
                port: config.get<number>('database.port'),
                synchronize: false,
                type: 'mssql',
                username: config.get('database.username'),
                options: {
                    encrypt: false,
                    trustServerCertificate: true,
                },
            }),
        }),
    ],
})
export class DatabaseModule {}
