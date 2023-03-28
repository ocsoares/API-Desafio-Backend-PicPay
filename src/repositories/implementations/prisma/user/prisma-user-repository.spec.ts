import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma-client.service';
import { IUser } from 'src/models/IUser';
import { PrismaUserRepository } from '../user/PrismaUserRepository';
import { prismaServiceTest } from '../test/prismaServiceTest';

describe('PrismaUserRepository', () => {
    let prismaService: PrismaService;
    let prismaUserRepository: PrismaUserRepository;
    let createdUser: IUser;
    let expectedCreatedUser: object;

    const userData: IUser = {
        role: 'user',
        full_name: 'test_user',
        cpf: '29364210042',
        email: 'testuser@gmail.com',
        password: 'testuser123',
        balance: 0,
    };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: PrismaService,
                    useValue: prismaServiceTest,
                },
                PrismaUserRepository,
            ],
        }).compile();

        prismaService = module.get<PrismaService>(PrismaService);

        prismaUserRepository =
            module.get<PrismaUserRepository>(PrismaUserRepository);

        jest.spyOn(prismaUserRepository, 'create');
        jest.spyOn(prismaUserRepository, 'findById');
        jest.spyOn(prismaUserRepository, 'findByEmail');
        jest.spyOn(prismaUserRepository, 'findByCPF');
    });

    afterAll(async () => {
        await prismaService.user.deleteMany();
        await prismaService.$disconnect();
    });

    it('should be defined', () => {
        expect(prismaService).toBeDefined();
        expect(prismaUserRepository).toBeDefined();
    });

    it('should create a user', async () => {
        createdUser = await prismaUserRepository.create(userData);

        expectedCreatedUser = {
            id: expect.any(String),
            ...userData,
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
        };

        const users = await prismaService.user.findMany();

        expect(prismaUserRepository.create).toHaveBeenCalledWith(userData);
        expect(users).toHaveLength(1);
        expect(users[0]).toEqual(expectedCreatedUser);
    });

    it('should find a user by ID', async () => {
        const userFound = await prismaUserRepository.findById(createdUser.id);

        expect(prismaUserRepository.findById).toHaveBeenCalledWith(
            createdUser.id,
        );

        expect(userFound).toEqual(expectedCreatedUser);
    });

    it('should find a user by email', async () => {
        const userFound = await prismaUserRepository.findByEmail(
            createdUser.email,
        );

        expect(prismaUserRepository.findByEmail).toHaveBeenCalledWith(
            createdUser.email,
        );

        expect(userFound).toEqual(expectedCreatedUser);
    });

    it('should find a user by CPF', async () => {
        const userFound = await prismaUserRepository.findByCPF(createdUser.cpf);

        expect(prismaUserRepository.findByCPF).toHaveBeenCalledWith(
            createdUser.cpf,
        );

        expect(userFound).toEqual(expectedCreatedUser);
    });
});
