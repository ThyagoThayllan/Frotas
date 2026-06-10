import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column()
    nickname: string;

    @Column({ name: 'password_hash', select: false })
    passwordHash: string;

    @Column({ unique: true })
    username: string;
}
