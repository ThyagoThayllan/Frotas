import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity('brands')
export class Brand extends BaseEntity {
    @Column({ unique: true })
    name: string;

    @OneToMany('Model', 'brand')
    models: any[];
}
