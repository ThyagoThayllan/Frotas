import { DataSource } from 'typeorm';
import { Brand } from '../../modules/brands/brand.entity';
import { Model } from '../../modules/models/model.entity';
import { Vehicle } from '../../modules/vehicles/vehicle.entity';
import rawSeedData from '../../../seed_vehicles.json';

export async function seedVehicles(dataSource: DataSource): Promise<void> {
    const brandRepository = dataSource.getRepository(Brand);
    const modelRepository = dataSource.getRepository(Model);
    const vehicleRepository = dataSource.getRepository(Vehicle);

    const existingCount = await vehicleRepository.count();

    if (existingCount > 0) {
        console.log('Vehicles already seeded, skipping.');
        return;
    }

    const seedData = Array.isArray(rawSeedData) ? rawSeedData : (rawSeedData as any).default;

    for (const entry of seedData) {
        let brand = await brandRepository.findOne({ where: { name: entry.brand } });

        if (!brand) {
            brand = await brandRepository.save(
                brandRepository.create({ createdBy: 'system', name: entry.brand }),
            );
        }

        let model = await modelRepository.findOne({ where: { name: entry.model, brandId: brand.id } });

        if (!model) {
            model = await modelRepository.save(
                modelRepository.create({ brandId: brand.id, createdBy: 'system', name: entry.model }),
            );
        }

        await vehicleRepository.save(
            vehicleRepository.create({
                chassis: entry.chassis,
                createdBy: 'system',
                licensePlate: entry.license_plate,
                modelId: model.id,
                renavam: entry.renavam,
                year: entry.year,
            }),
        );
    }

    console.log(`${seedData.length} vehicles seeded.`);
}
