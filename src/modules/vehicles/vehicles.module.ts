import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsModule } from '../models/models.module';
import { Vehicle } from './vehicle.entity';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
    controllers: [VehiclesController],
    imports: [ModelsModule, TypeOrmModule.forFeature([Vehicle])],
    providers: [VehiclesService],
})
export class VehiclesModule {}
