import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

async function createDatabaseIfNotExists(): Promise<void> {
    const dbName = process.env.DB_DATABASE;

    const masterSource = new DataSource({
        database: 'master',
        host: process.env.DB_HOST,
        options: {
            encrypt: false,
            trustServerCertificate: true,
        },
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT, 10) || 1433,
        type: 'mssql',
        username: process.env.DB_USERNAME,
    });

    await masterSource.initialize();

    await masterSource.query(
        `IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '${dbName}') CREATE DATABASE [${dbName}]`,
    );

    await masterSource.destroy();
}

export async function initializeDatabase(): Promise<void> {
    console.log('[Bootstrap] Verifying database...');
    await createDatabaseIfNotExists();

    const { AppDataSource } = await import('./data-source');

    console.log('[Bootstrap] Running migrations...');
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();

    console.log('[Bootstrap] Running seeds...');
    const { seedUser } = await import('./seeds/seed-user');
    await seedUser(AppDataSource);

    const { seedVehicles } = await import('./seeds/seed-vehicles');
    await seedVehicles(AppDataSource);

    await AppDataSource.destroy();
    console.log('[Bootstrap] Database ready.');
}
