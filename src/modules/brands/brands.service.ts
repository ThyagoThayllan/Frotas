import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './brand.entity';

@Injectable()
export class BrandsService {
    constructor(
        @InjectRepository(Brand)
        private readonly brandsRepository: Repository<Brand>,
    ) {}

    private async assertNameAvailable(name: string): Promise<void> {
        const exists = await this.brandsRepository.findOne({ where: { name } });

        if (exists) throw new ConflictException(`Brand name "${name}" already in use`);
    }

    async create(dto: CreateBrandDto, createdBy: string): Promise<Brand> {
        await this.assertNameAvailable(dto.name);

        const brand = this.brandsRepository.create({ createdBy, name: dto.name });

        return this.brandsRepository.save(brand);
    }

    async findAll(): Promise<Brand[]> {
        return this.brandsRepository.find({ order: { name: 'ASC' } });
    }

    async findOne(id: string): Promise<Brand> {
        const brand = await this.brandsRepository.findOne({ where: { id } });

        if (!brand) throw new NotFoundException(`Brand ${id} not found`);

        return brand;
    }

    async update(id: string, dto: UpdateBrandDto, updatedBy: string): Promise<Brand> {
        const brand = await this.findOne(id);

        if (dto.name && dto.name !== brand.name) {
            await this.assertNameAvailable(dto.name);
        }

        if (dto.name) brand.name = dto.name;

        brand.createdBy = updatedBy;

        return this.brandsRepository.save(brand);
    }

    async remove(id: string): Promise<void> {
        const brand = await this.brandsRepository.findOne({
            where: { id },
            relations: ['models'],
        });

        if (!brand) throw new NotFoundException(`Brand ${id} not found`);

        if (brand.models?.length > 0) {
            throw new ConflictException(
                `Brand ${id} cannot be removed because it has associated models`,
            );
        }

        await this.brandsRepository.remove(brand);
    }
}
