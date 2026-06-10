import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { Model } from '../models/model.entity';

@Entity('vehicles')
export class Vehicle extends BaseEntity {
    @Column({ unique: true })
    chassis: string;

    @Column({ name: 'license_plate', unique: true })
    licensePlate: string;

    @ManyToOne(() => Model, (model) => model.vehicles, { eager: false, nullable: false })
    @JoinColumn({ name: 'model_id' })
    model: Model;

    @Column({ name: 'model_id' })
    modelId: string;

    @Column({ unique: true })
    renavam: string;

    @Column()
    year: number;
}
