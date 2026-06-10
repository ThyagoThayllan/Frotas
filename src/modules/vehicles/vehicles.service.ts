import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { ModelsService } from '../models/models.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './vehicle.entity';

const CACHE_KEY_ALL = 'vehicles:all';
const cacheKeyOne = (id: string) => `vehicles:${id}`;

@Injectable()
export class VehiclesService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
        @InjectRepository(Vehicle)
        private readonly vehiclesRepository: Repository<Vehicle>,
        private readonly modelsService: ModelsService,
    ) {}

    private async assertUnique(params: {
        chassis?: string;
        excludeId?: string;
        licensePlate?: string;
        renavam?: string;
    }): Promise<void> {
        const { chassis, excludeId, licensePlate, renavam } = params;

        const checks: Array<{ field: string; value: string; column: string }> = [];

        if (chassis) checks.push({ column: 'chassis', field: 'Chassis', value: chassis });
        if (licensePlate) checks.push({ column: 'licensePlate', field: 'License plate', value: licensePlate });
        if (renavam) checks.push({ column: 'renavam', field: 'Renavam', value: renavam });

        for (const check of checks) {
            const existing = await this.vehiclesRepository.findOne({
                where: { [check.column]: check.value },
            });

            if (existing && existing.id !== excludeId) {
                throw new ConflictException(`${check.field} "${check.value}" already in use`);
            }
        }
    }

    private async invalidateCache(id?: string): Promise<void> {
        await this.cacheManager.del(CACHE_KEY_ALL);

        if (id) await this.cacheManager.del(cacheKeyOne(id));
    }

    async create(dto: CreateVehicleDto, createdBy: string): Promise<Vehicle> {
        await this.modelsService.findOne(dto.modelId);
        await this.assertUnique({
            chassis: dto.chassis,
            licensePlate: dto.licensePlate,
            renavam: dto.renavam
        });

        const vehicle = this.vehiclesRepository.create({
            chassis: dto.chassis,
            createdBy,
            licensePlate: dto.licensePlate,
            modelId: dto.modelId,
            renavam: dto.renavam,
            year: dto.year,
        });

        const saved = await this.vehiclesRepository.save(vehicle);

        await this.invalidateCache();

        return saved;
    }

    async findAll(): Promise<Vehicle[]> {
        const cached = await this.cacheManager.get<Vehicle[]>(CACHE_KEY_ALL);

        if (cached) return cached;

        const vehicles = await this.vehiclesRepository.find({
            order: { createdAt: 'DESC' },
            relations: ['model', 'model.brand'],
        });

        await this.cacheManager.set(CACHE_KEY_ALL, vehicles);

        return vehicles;
    }

    async findOne(id: string): Promise<Vehicle> {
        const cached = await this.cacheManager.get<Vehicle>(cacheKeyOne(id));

        if (cached) return cached;

        const vehicle = await this.vehiclesRepository.findOne({
            relations: ['model', 'model.brand'],
            where: { id },
        });

        if (!vehicle) throw new NotFoundException(`Vehicle ${id} not found`);

        await this.cacheManager.set(cacheKeyOne(id), vehicle);

        return vehicle;
    }

    async update(id: string, dto: UpdateVehicleDto, updatedBy: string): Promise<Vehicle> {
        const vehicle = await this.findOne(id);

        await this.assertUnique({
            chassis: dto.chassis,
            excludeId: id,
            licensePlate: dto.licensePlate,
            renavam: dto.renavam,
        });

        if (dto.modelId) {
            await this.modelsService.findOne(dto.modelId);
            vehicle.modelId = dto.modelId;
        }

        if (dto.chassis) vehicle.chassis = dto.chassis;
        if (dto.licensePlate) vehicle.licensePlate = dto.licensePlate;
        if (dto.renavam) vehicle.renavam = dto.renavam;
        if (dto.year) vehicle.year = dto.year;

        vehicle.createdBy = updatedBy;

        const saved = await this.vehiclesRepository.save(vehicle);

        await this.invalidateCache(id);

        return saved;
    }

    async remove(id: string): Promise<void> {
        const vehicle = await this.findOne(id);

        await this.vehiclesRepository.remove(vehicle);
        await this.invalidateCache(id);
    }
}
