import { AppDataSource } from '../data-source';

async function runSeed() {
    await AppDataSource.initialize();

    console.log('Running seeds...');

    const { seedUser } = await import('./seed-user');
    await seedUser(AppDataSource);

    const { seedVehicles } = await import('./seed-vehicles');
    await seedVehicles(AppDataSource);

    console.log('Seeds completed.');
    await AppDataSource.destroy();
}

runSeed().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
});
