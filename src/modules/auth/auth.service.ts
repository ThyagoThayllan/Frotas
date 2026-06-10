import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) {}

    async login(dto: LoginDto): Promise<{ access_token: string }> {
        const user = await this.usersService.findByUsername(dto.username);

        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);

        if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

        const payload = { sub: user.id, username: user.username };

        return { access_token: this.jwtService.sign(payload) };
    }
}
