import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/shared/filters/http-exception.filter';

describe('API (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let token: string;
    let brandId: string;
    let modelId: string;
    let vehicleId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider('ConfigService')
            .useValue({
                get: (key: string) => {
                    const config: Record<string, any> = {
                        'cache.ttl': 300,
                        'database.database': ':memory:',
                        'database.host': '',
                        'database.password': '',
                        'database.port': 0,
                        'database.username': '',
                        'jwt.expiresIn': '1d',
                        'jwt.secret': 'test-secret',
                        nodeEnv: 'test',
                        port: 3001,
                        'redis.host': 'localhost',
                        'redis.port': 6379,
                    };

                    return config[key];
                },
            })
            .compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({ forbidNonWhitelisted: true, transform: true, whitelist: true }),
        );

        app.useGlobalFilters(new HttpExceptionFilter());

        await app.init();

        dataSource = moduleFixture.get<DataSource>(DataSource);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /auth/login', () => {
        beforeAll(async () => {
            const userRepository = app
                .get(getRepositoryToken(require('../src/modules/users/user.entity').User));

            const passwordHash = await bcrypt.hash('aivacol@2024', 10);

            await userRepository.save(
                userRepository.create({
                    createdBy: 'system',
                    email: 'aivacol@test.com',
                    name: 'Aivacol Test',
                    nickname: 'aivacol',
                    passwordHash,
                    username: 'aivacol',
                }),
            );
        });

        it('should return 401 with invalid credentials', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({ password: 'errada', username: 'aivacol' })
                .expect(401);
        });

        it('should return access_token with valid credentials', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ password: 'aivacol@2024', username: 'aivacol' })
                .expect(200);

            expect(response.body).toHaveProperty('access_token');
            token = response.body.access_token;
        });
    });

    describe('Routes protection', () => {
        it('should return 401 when no token is provided', async () => {
            await request(app.getHttpServer()).get('/vehicles').expect(401);
        });
    });

    describe('POST /brands', () => {
        it('should create a brand', async () => {
            const response = await request(app.getHttpServer())
                .post('/brands')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Toyota' })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe('Toyota');
            brandId = response.body.id;
        });

        it('should return 409 when brand name already exists', async () => {
            await request(app.getHttpServer())
                .post('/brands')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Toyota' })
                .expect(409);
        });

        it('should return 400 when name is missing', async () => {
            await request(app.getHttpServer())
                .post('/brands')
                .set('Authorization', `Bearer ${token}`)
                .send({})
                .expect(400);
        });
    });

    describe('POST /models', () => {
        it('should create a model associated with a brand', async () => {
            const response = await request(app.getHttpServer())
                .post('/models')
                .set('Authorization', `Bearer ${token}`)
                .send({ brandId, name: 'Corolla' })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe('Corolla');
            modelId = response.body.id;
        });

        it('should return 404 when brand does not exist', async () => {
            await request(app.getHttpServer())
                .post('/models')
                .set('Authorization', `Bearer ${token}`)
                .send({ brandId: '00000000-0000-0000-0000-000000000000', name: 'Inexistente' })
                .expect(404);
        });
    });

    describe('POST /vehicles', () => {
        it('should create a vehicle', async () => {
            const response = await request(app.getHttpServer())
                .post('/vehicles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    chassis: '9BWZZZ377VT004251',
                    licensePlate: 'ABC1D23',
                    modelId,
                    renavam: '00123456789',
                    year: 2022,
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.licensePlate).toBe('ABC1D23');
            vehicleId = response.body.id;
        });

        it('should return 409 when license plate already exists', async () => {
            await request(app.getHttpServer())
                .post('/vehicles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    chassis: '9BWZZZ377VT004999',
                    licensePlate: 'ABC1D23',
                    modelId,
                    renavam: '00999999999',
                    year: 2022,
                })
                .expect(409);
        });

        it('should return 400 when year is out of range', async () => {
            await request(app.getHttpServer())
                .post('/vehicles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    chassis: '9BWZZZ377VT000000',
                    licensePlate: 'ZZZ9Z99',
                    modelId,
                    renavam: '00000000000',
                    year: 1800,
                })
                .expect(400);
        });
    });

    describe('GET /vehicles', () => {
        it('should return list of vehicles', async () => {
            const response = await request(app.getHttpServer())
                .get('/vehicles')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return a vehicle by id', async () => {
            const response = await request(app.getHttpServer())
                .get(`/vehicles/${vehicleId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body.id).toBe(vehicleId);
        });

        it('should return 404 for non-existent vehicle', async () => {
            await request(app.getHttpServer())
                .get('/vehicles/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
    });

    describe('PATCH /vehicles/:id', () => {
        it('should update a vehicle', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/vehicles/${vehicleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ year: 2023 })
                .expect(200);

            expect(response.body.year).toBe(2023);
        });
    });

    describe('DELETE /vehicles/:id', () => {
        it('should delete a vehicle and return 204', async () => {
            await request(app.getHttpServer())
                .delete(`/vehicles/${vehicleId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204);
        });

        it('should return 404 after deletion', async () => {
            await request(app.getHttpServer())
                .get(`/vehicles/${vehicleId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
    });

    describe('DELETE /brands/:id', () => {
        it('should return 409 when brand has associated models', async () => {
            await request(app.getHttpServer())
                .delete(`/brands/${brandId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(409);
        });
    });
});
