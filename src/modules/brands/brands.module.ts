import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';

@Module({
    controllers: [BrandsController],
    exports: [BrandsService],
    imports: [TypeOrmModule.forFeature([Brand])],
    providers: [BrandsService],
})
export class BrandsModule {}
