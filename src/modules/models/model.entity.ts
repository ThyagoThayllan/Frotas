import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { Brand } from '../brands/brand.entity';

@Entity('models')
export class Model extends BaseEntity {
    @ManyToOne(() => Brand, (brand) => brand.models, { eager: false, nullable: false })
    @JoinColumn({ name: 'brand_id' })
    brand: Brand;

    @Column({ name: 'brand_id' })
    brandId: string;

    @Column()
    name: string;

    @OneToMany('Vehicle', 'model')
    vehicles: any[];
}
