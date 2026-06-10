import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Brand } from '@/modules/brands/brand.entity';
import { BrandsService } from '@/modules/brands/brands.service';

const mockBrand = (overrides = {}): Brand =>
    ({
        createdAt: new Date(),
        createdBy: 'aivacol',
        id: 'brand-uuid',
        models: [],
        name: 'Toyota',
        updatedAt: new Date(),
        ...overrides,
    }) as Brand;

const mockRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
};

describe('BrandsService', () => {
    let brandsService: BrandsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BrandsService,
                { provide: getRepositoryToken(Brand), useValue: mockRepository },
            ],
        }).compile();

        brandsService = module.get<BrandsService>(BrandsService);
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create and return a brand', async () => {
            const brand = mockBrand();

            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(brand);
            mockRepository.save.mockResolvedValue(brand);

            const result = await brandsService.create({ name: 'Toyota' }, 'aivacol');

            expect(result).toEqual(brand);
            expect(mockRepository.save).toHaveBeenCalledWith(brand);
        });

        it('should throw ConflictException when name already exists', async () => {
            mockRepository.findOne.mockResolvedValue(mockBrand());

            await expect(
                brandsService.create({ name: 'Toyota' }, 'aivacol'),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('findAll', () => {
        it('should return an array of brands', async () => {
            const brands = [mockBrand(), mockBrand({ id: 'brand-uuid-2', name: 'Honda' })];
            mockRepository.find.mockResolvedValue(brands);

            const result = await brandsService.findAll();

            expect(result).toEqual(brands);
            expect(mockRepository.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });
        });
    });

    describe('findOne', () => {
        it('should return a brand by id', async () => {
            const brand = mockBrand();
            mockRepository.findOne.mockResolvedValue(brand);

            const result = await brandsService.findOne('brand-uuid');

            expect(result).toEqual(brand);
        });

        it('should throw NotFoundException when brand does not exist', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(brandsService.findOne('inexistente')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update and return the brand', async () => {
            const brand = mockBrand();
            const updated = mockBrand({ name: 'Honda' });

            mockRepository.findOne.mockResolvedValueOnce(brand).mockResolvedValueOnce(null);
            mockRepository.save.mockResolvedValue(updated);

            const result = await brandsService.update('brand-uuid', { name: 'Honda' }, 'aivacol');

            expect(result.name).toBe('Honda');
        });

        it('should throw NotFoundException when brand does not exist', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(
                brandsService.update('inexistente', { name: 'Honda' }, 'aivacol'),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a brand with no associated models', async () => {
            const brand = mockBrand({ models: [] });
            mockRepository.findOne.mockResolvedValue(brand);
            mockRepository.remove.mockResolvedValue(brand);

            await expect(brandsService.remove('brand-uuid')).resolves.not.toThrow();
            expect(mockRepository.remove).toHaveBeenCalledWith(brand);
        });

        it('should throw ConflictException when brand has associated models', async () => {
            const brand = mockBrand({ models: [{ id: 'model-uuid' }] });
            mockRepository.findOne.mockResolvedValue(brand);

            await expect(brandsService.remove('brand-uuid')).rejects.toThrow(ConflictException);
        });

        it('should throw NotFoundException when brand does not exist', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(brandsService.remove('inexistente')).rejects.toThrow(NotFoundException);
        });
    });
});
