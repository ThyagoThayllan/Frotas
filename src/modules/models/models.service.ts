import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandsService } from '../brands/brands.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { Model } from './model.entity';

@Injectable()
export class ModelsService {
    constructor(
        @InjectRepository(Model)
        private readonly modelsRepository: Repository<Model>,
        private readonly brandsService: BrandsService,
    ) {}

    async create(dto: CreateModelDto, createdBy: string): Promise<Model> {
        await this.brandsService.findOne(dto.brandId);

        const model = this.modelsRepository.create({
            brandId: dto.brandId,
            createdBy,
            name: dto.name,
        });

        return this.modelsRepository.save(model);
    }

    async findAll(): Promise<Model[]> {
        return this.modelsRepository.find({
            order: { name: 'ASC' },
            relations: ['brand'],
        });
    }

    async findOne(id: string): Promise<Model> {
        const model = await this.modelsRepository.findOne({
            relations: ['brand'],
            where: { id },
        });

        if (!model) throw new NotFoundException(`Model ${id} not found`);

        return model;
    }

    async update(id: string, dto: UpdateModelDto, updatedBy: string): Promise<Model> {
        const model = await this.findOne(id);

        if (dto.brandId) {
            await this.brandsService.findOne(dto.brandId);
            model.brandId = dto.brandId;
        }

        if (dto.name) model.name = dto.name;

        model.createdBy = updatedBy;

        return this.modelsRepository.save(model);
    }

    async remove(id: string): Promise<void> {
        const model = await this.modelsRepository.findOne({
            relations: ['vehicles'],
            where: { id },
        });

        if (!model) throw new NotFoundException(`Model ${id} not found`);

        if (model.vehicles?.length > 0) {
            throw new ConflictException(
                `Model ${id} cannot be removed because it has associated vehicles`,
            );
        }

        await this.modelsRepository.remove(model);
    }
}
