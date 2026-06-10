import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    private async assertEmailAvailable(email: string): Promise<void> {
        const exists = await this.usersRepository.findOne({ where: { email } });

        if (exists) throw new ConflictException(`Email ${email} already in use`);
    }

    private async assertUsernameAvailable(username: string): Promise<void> {
        const exists = await this.usersRepository.findOne({ where: { username } });

        if (exists) throw new ConflictException(`Username ${username} already in use`);
    }

    async create(dto: CreateUserDto, createdBy: string): Promise<User> {
        await this.assertUsernameAvailable(dto.username);
        await this.assertEmailAvailable(dto.email);

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = this.usersRepository.create({
            createdBy,
            email: dto.email,
            name: dto.name,
            nickname: dto.nickname,
            passwordHash,
            username: dto.username,
        });

        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });

        if (!user) throw new NotFoundException(`User ${id} not found`);

        return user;
    }

    async findByUsername(username: string): Promise<User> {
        return this.usersRepository
            .createQueryBuilder('user')
            .addSelect('user.passwordHash')
            .where('user.username = :username', { username })
            .getOne();
    }

    async update(id: string, dto: UpdateUserDto, updatedBy: string): Promise<User> {
        const user = await this.findOne(id);

        if (dto.email && dto.email !== user.email) {
            await this.assertEmailAvailable(dto.email);
        }

        if (dto.password) {
            (user as any).passwordHash = await bcrypt.hash(dto.password, 10);
        }

        if (dto.email) user.email = dto.email;
        if (dto.name) user.name = dto.name;
        if (dto.nickname) user.nickname = dto.nickname;

        user.createdBy = updatedBy;

        return this.usersRepository.save(user);
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);

        await this.usersRepository.remove(user);
    }
}
