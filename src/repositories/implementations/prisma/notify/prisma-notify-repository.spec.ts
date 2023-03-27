import { Test } from '@nestjs/testing';
import { INotify } from '../../../../models/INotify';
import { PrismaService } from '../prisma-client.service';
import { PrismaNotifyRepository } from '../notify/PrismaNotifyRepository';
import { IUser } from 'src/models/IUser';
import { PrismaUserRepository } from '../user/PrismaUserRepository';
import { prismaServiceTest } from '../test/prismaServiceTest';

describe('PrismaNotifyRepository', () => {
    let prismaNotifyRepository: PrismaNotifyRepository;
    let prismaUserRepository: PrismaUserRepository;
    let prismaService: PrismaService;

    const userData: IUser = {
        role: 'user',
        full_name: 'test_notify',
        cpf: '67583687004',
        email: 'testnotify@gmail.com',
        password: 'testnotify123',
        balance: 0,
    };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: PrismaService,
                    useValue: prismaServiceTest,
                },
                PrismaNotifyRepository,
                PrismaUserRepository,
            ],
        }).compile();

        prismaService = module.get<PrismaService>(PrismaService);

        prismaNotifyRepository = module.get<PrismaNotifyRepository>(
            PrismaNotifyRepository,
        );

        prismaUserRepository =
            module.get<PrismaUserRepository>(PrismaUserRepository);

        jest.spyOn(prismaNotifyRepository, 'send');
        jest.spyOn(prismaUserRepository, 'create');
    });

    afterAll(async () => {
        await prismaService.$disconnect();
    });

    beforeEach(async () => {
        await prismaService.notify.deleteMany();
        await prismaService.user.deleteMany();
    });

    it('should be defined', () => {
        expect(prismaService).toBeDefined();
        expect(prismaNotifyRepository).toBeDefined();
        expect(prismaUserRepository).toBeDefined();
    });

    it('should send a notification', async () => {
        const createdUser = await prismaUserRepository.create(userData);

        const notifyData: INotify = {
            payer_name: 'test_payer',
            payer_cpf: '59563681010',
            transfer_amount: 140.25,
            transfer_time: new Date(),
            to_user_id: createdUser.id,
        };

        const expectedNotification = {
            id: expect.any(String),
            ...notifyData,
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
        };

        await prismaNotifyRepository.send(notifyData);

        const notifications = await prismaService.notify.findMany();

        expect(prismaUserRepository.create).toHaveBeenCalledWith(userData);
        expect(prismaNotifyRepository.send).toHaveBeenCalledWith(notifyData);
        expect(notifications[0]).toEqual(expectedNotification);
        expect(notifications).toHaveLength(1);
    });
});
