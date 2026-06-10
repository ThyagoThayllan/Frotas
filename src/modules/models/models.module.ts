import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsModule } from '../brands/brands.module';
import { Model } from './model.entity';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';

@Module({
    controllers: [ModelsController],
    exports: [ModelsService],
    imports: [BrandsModule, TypeOrmModule.forFeature([Model])],
    providers: [ModelsService],
})
export class ModelsModule {}
