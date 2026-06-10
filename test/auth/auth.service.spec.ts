import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from '@/modules/auth/auth.service';
import { UsersService } from '@/modules/users/users.service';

const mockUsersService = {
    findByUsername: jest.fn(),
};

const mockJwtService = {
    sign: jest.fn(),
};

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: JwtService, useValue: mockJwtService },
                { provide: UsersService, useValue: mockUsersService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return access_token when credentials are valid', async () => {
            const passwordHash = await bcrypt.hash('senha123', 10);

            mockUsersService.findByUsername.mockResolvedValue({
                id: 'user-uuid',
                passwordHash,
                username: 'aivacol',
            });

            mockJwtService.sign.mockReturnValue('mocked.jwt.token');

            const result = await authService.login({ password: 'senha123', username: 'aivacol' });

            expect(result).toEqual({ access_token: 'mocked.jwt.token' });
            expect(mockJwtService.sign).toHaveBeenCalledWith({
                sub: 'user-uuid',
                username: 'aivacol',
            });
        });

        it('should throw UnauthorizedException when user does not exist', async () => {
            mockUsersService.findByUsername.mockResolvedValue(null);

            await expect(
                authService.login({ password: 'qualquer', username: 'inexistente' }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException when password is wrong', async () => {
            const passwordHash = await bcrypt.hash('correta', 10);

            mockUsersService.findByUsername.mockResolvedValue({
                id: 'user-uuid',
                passwordHash,
                username: 'aivacol',
            });

            await expect(
                authService.login({ password: 'errada', username: 'aivacol' }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
