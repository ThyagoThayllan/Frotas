import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    host: process.env.DB_HOST,
    logging: process.env.NODE_ENV === 'development',
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    synchronize: false,
    type: 'mssql',
    username: process.env.DB_USERNAME,
});
