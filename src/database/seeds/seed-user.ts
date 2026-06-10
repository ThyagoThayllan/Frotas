import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../../modules/users/user.entity';

dotenv.config();

export async function seedUser(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(User);

    const exists = await repository.findOne({ where: { username: 'aivacol' } });

    if (exists) {
        console.log('User aivacol already exists, skipping.');
        return;
    }

    const password = process.env.SEED_USER_PASSWORD || 'aivacol@2024';
    const passwordHash = await bcrypt.hash(password, 10);

    await repository.save(
        repository.create({
            createdBy: 'system',
            email: 'aivacol@aivacol.com',
            name: 'Aivacol Admin',
            nickname: 'aivacol',
            passwordHash,
            username: 'aivacol',
        }),
    );

    console.log('User aivacol created.');
}
