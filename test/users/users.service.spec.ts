import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@/modules/users/user.entity';
import { UsersService } from '@/modules/users/users.service';

const mockUser = (overrides = {}): User =>
    ({
        createdAt: new Date(),
        createdBy: 'aivacol',
        email: 'admin@aivacol.com',
        id: 'user-uuid',
        name: 'Admin',
        nickname: 'admin',
        passwordHash: 'hashed',
        updatedAt: new Date(),
        username: 'aivacol',
        ...overrides,
    }) as User;

const mockRepository = {
    create: jest.fn(),
    createQueryBuilder: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
};

describe('UsersService', () => {
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: getRepositoryToken(User), useValue: mockRepository },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            const users = [mockUser()];
            mockRepository.find.mockResolvedValue(users);

            const result = await usersService.findAll();

            expect(result).toEqual(users);
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            const user = mockUser();
            mockRepository.findOne.mockResolvedValue(user);

            const result = await usersService.findOne('user-uuid');

            expect(result).toEqual(user);
        });

        it('should throw NotFoundException when user does not exist', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(usersService.findOne('inexistente')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should throw ConflictException when username already exists', async () => {
            mockRepository.findOne.mockResolvedValue(mockUser());

            await expect(
                usersService.create(
                    {
                        email: 'outro@email.com',
                        name: 'Outro',
                        nickname: 'outro',
                        password: 'senha123',
                        username: 'aivacol',
                    },
                    'system',
                ),
            ).rejects.toThrow(ConflictException);
        });

        it('should throw ConflictException when email already exists', async () => {
            mockRepository.findOne
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(mockUser());

            await expect(
                usersService.create(
                    {
                        email: 'admin@aivacol.com',
                        name: 'Outro',
                        nickname: 'outro',
                        password: 'senha123',
                        username: 'outro',
                    },
                    'system',
                ),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            const user = mockUser();
            mockRepository.findOne.mockResolvedValue(user);
            mockRepository.remove.mockResolvedValue(user);

            await expect(usersService.remove('user-uuid')).resolves.not.toThrow();
            expect(mockRepository.remove).toHaveBeenCalledWith(user);
        });
    });
});
