import { ConflictException, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ModelsService } from '@/modules/models/models.service';
import { Vehicle } from '@/modules/vehicles/vehicle.entity';
import { VehiclesService } from '@/modules/vehicles/vehicles.service';

const mockVehicle = (overrides = {}): Vehicle =>
    ({
        chassis: '9BWZZZ377VT004251',
        createdAt: new Date(),
        createdBy: 'aivacol',
        id: 'vehicle-uuid',
        licensePlate: 'ABC1D23',
        model: { brand: { name: 'Toyota' }, id: 'model-uuid', name: 'Corolla' },
        modelId: 'model-uuid',
        renavam: '00123456789',
        updatedAt: new Date(),
        year: 2022,
        ...overrides,
    }) as Vehicle;

const mockRepository = {
    count: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
};

const mockCacheManager = {
    del: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
};

const mockModelsService = {
    findOne: jest.fn(),
};

describe('VehiclesService', () => {
    let vehiclesService: VehiclesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VehiclesService,
                { provide: CACHE_MANAGER, useValue: mockCacheManager },
                { provide: getRepositoryToken(Vehicle), useValue: mockRepository },
                { provide: ModelsService, useValue: mockModelsService },
            ],
        }).compile();

        vehiclesService = module.get<VehiclesService>(VehiclesService);
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a vehicle and invalidate cache', async () => {
            const vehicle = mockVehicle();

            mockModelsService.findOne.mockResolvedValue({ id: 'model-uuid' });
            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(vehicle);
            mockRepository.save.mockResolvedValue(vehicle);
            mockCacheManager.del.mockResolvedValue(undefined);

            const result = await vehiclesService.create(
                {
                    chassis: vehicle.chassis,
                    licensePlate: vehicle.licensePlate,
                    modelId: vehicle.modelId,
                    renavam: vehicle.renavam,
                    year: vehicle.year,
                },
                'aivacol',
            );

            expect(result).toEqual(vehicle);
            expect(mockCacheManager.del).toHaveBeenCalledWith('vehicles:all');
        });

        it('should throw ConflictException when license plate already exists', async () => {
            mockModelsService.findOne.mockResolvedValue({ id: 'model-uuid' });
            mockRepository.findOne.mockResolvedValue(mockVehicle());

            await expect(
                vehiclesService.create(
                    {
                        chassis: '9BWZZZ377VT004251',
                        licensePlate: 'ABC1D23',
                        modelId: 'model-uuid',
                        renavam: '00123456789',
                        year: 2022,
                    },
                    'aivacol',
                ),
            ).rejects.toThrow(ConflictException);
        });

        it('should throw NotFoundException when model does not exist', async () => {
            mockModelsService.findOne.mockRejectedValue(new NotFoundException());

            await expect(
                vehiclesService.create(
                    {
                        chassis: '9BWZZZ377VT004251',
                        licensePlate: 'ABC1D23',
                        modelId: 'inexistente',
                        renavam: '00123456789',
                        year: 2022,
                    },
                    'aivacol',
                ),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return vehicles from cache when available', async () => {
            const vehicles = [mockVehicle()];
            mockCacheManager.get.mockResolvedValue(vehicles);

            const result = await vehiclesService.findAll();

            expect(result).toEqual(vehicles);
            expect(mockRepository.find).not.toHaveBeenCalled();
        });

        it('should query database and populate cache when cache is empty', async () => {
            const vehicles = [mockVehicle()];

            mockCacheManager.get.mockResolvedValue(null);
            mockRepository.find.mockResolvedValue(vehicles);
            mockCacheManager.set.mockResolvedValue(undefined);

            const result = await vehiclesService.findAll();

            expect(result).toEqual(vehicles);
            expect(mockRepository.find).toHaveBeenCalled();
            expect(mockCacheManager.set).toHaveBeenCalledWith('vehicles:all', vehicles);
        });
    });

    describe('findOne', () => {
        it('should return vehicle from cache when available', async () => {
            const vehicle = mockVehicle();
            mockCacheManager.get.mockResolvedValue(vehicle);

            const result = await vehiclesService.findOne('vehicle-uuid');

            expect(result).toEqual(vehicle);
            expect(mockRepository.findOne).not.toHaveBeenCalled();
        });

        it('should query database and populate cache when cache is empty', async () => {
            const vehicle = mockVehicle();

            mockCacheManager.get.mockResolvedValue(null);
            mockRepository.findOne.mockResolvedValue(vehicle);
            mockCacheManager.set.mockResolvedValue(undefined);

            const result = await vehiclesService.findOne('vehicle-uuid');

            expect(result).toEqual(vehicle);
            expect(mockCacheManager.set).toHaveBeenCalledWith('vehicles:vehicle-uuid', vehicle);
        });

        it('should throw NotFoundException when vehicle does not exist', async () => {
            mockCacheManager.get.mockResolvedValue(null);
            mockRepository.findOne.mockResolvedValue(null);

            await expect(vehiclesService.findOne('inexistente')).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove vehicle and invalidate cache', async () => {
            const vehicle = mockVehicle();

            mockCacheManager.get.mockResolvedValue(vehicle);
            mockRepository.remove.mockResolvedValue(vehicle);
            mockCacheManager.del.mockResolvedValue(undefined);

            await vehiclesService.remove('vehicle-uuid');

            expect(mockRepository.remove).toHaveBeenCalledWith(vehicle);
            expect(mockCacheManager.del).toHaveBeenCalledWith('vehicles:all');
            expect(mockCacheManager.del).toHaveBeenCalledWith('vehicles:vehicle-uuid');
        });
    });
});
