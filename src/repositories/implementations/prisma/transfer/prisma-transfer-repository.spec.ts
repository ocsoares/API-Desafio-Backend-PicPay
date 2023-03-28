import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma-client.service';
import { IUser } from 'src/models/IUser';
import { PrismaUserRepository } from '../user/PrismaUserRepository';
import { prismaServiceTest } from '../test/prismaServiceTest';
import { PrismaTransferRepository } from './PrismaTransferRepository';
import { ITransfer } from '../../../../models/ITransfer';

// ENTENDER o porque tava dando erro com o:
// await prismaService.user.deleteMany();
// no afterAll, e sem o prismaService.notify.deleteMany(); !!!

// OBS: ESSE aqui do Lado também >>>>
// OBS: Ver também se não é causado pelo notify !!!

describe('PrismaTransferRepository', () => {
    let prismaUserRepository: PrismaUserRepository;
    let prismaTransferRepository: PrismaTransferRepository;
    let prismaService: PrismaService;
    let payerUser: IUser;
    let expectedPayerUser: object;
    let receiverUser: IUser;
    let expectedReceiverUser: object;

    const payerUserData: IUser = {
        role: 'user', // Apenas user
        full_name: 'payer_user',
        cpf: '97639801001',
        email: 'payeruser@gmail.com',
        password: 'payeruser123',
        balance: 210.5,
    };

    const receiverUserData: IUser = {
        role: 'shopkeeper', // Pode ser tanto user quanto shopkeeper
        full_name: 'receiver_user',
        cpf: '68845877094',
        email: 'receiveruser@gmail.com',
        password: 'receiveruser123',
        balance: 0,
    };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: PrismaService,
                    useValue: prismaServiceTest,
                },
                PrismaTransferRepository,
                PrismaUserRepository,
            ],
        }).compile();

        prismaService = module.get<PrismaService>(PrismaService);

        prismaUserRepository =
            module.get<PrismaUserRepository>(PrismaUserRepository);

        prismaTransferRepository = module.get<PrismaTransferRepository>(
            PrismaTransferRepository,
        );

        jest.spyOn(prismaUserRepository, 'create');
        jest.spyOn(prismaTransferRepository, 'transfer');
        jest.spyOn(prismaUserRepository, 'findById');
    });

    afterAll(async () => {
        // Como o notify é associado ao user, tem que limpar primeiro, se não dá erro
        await prismaService.notify.deleteMany();

        await prismaService.user.deleteMany();
        await prismaService.$disconnect();
    });

    it('should be defined', () => {
        expect(prismaService).toBeDefined();
        expect(prismaTransferRepository).toBeDefined();
        expect(prismaUserRepository).toBeDefined();
    });

    it('should create the users', async () => {
        payerUser = await prismaUserRepository.create(payerUserData);

        expectedPayerUser = {
            id: expect.any(String),
            ...payerUser,
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
        };

        receiverUser = await prismaUserRepository.create(receiverUserData);

        expectedReceiverUser = {
            id: expect.any(String),
            ...receiverUser,
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
        };

        const users = await prismaService.user.findMany();

        expect(prismaUserRepository.create).toHaveBeenCalledWith(payerUserData);

        expect(prismaUserRepository.create).toHaveBeenCalledWith(
            receiverUserData,
        );

        expect(users).toHaveLength(2);
        expect(users[0]).toEqual(expectedPayerUser);
        expect(users[1]).toEqual(expectedReceiverUser);
    });

    it('should make a transfer', async () => {
        const transferData: ITransfer = {
            account_id: payerUser.id,
            to_user_email: receiverUser.email,
            value: 10.5,
        };

        await prismaTransferRepository.transfer(transferData);

        const payerUserFound = await prismaUserRepository.findById(
            payerUser.id,
        );

        const receiverUserFound = await prismaUserRepository.findById(
            receiverUser.id,
        );

        expect(prismaTransferRepository.transfer).toHaveBeenCalledWith(
            transferData,
        );

        expect(prismaUserRepository.findById).toHaveBeenCalledWith(
            payerUser.id,
        );

        expect(payerUser).toEqual(expectedPayerUser);

        expect(prismaUserRepository.findById).toHaveBeenCalledWith(
            receiverUser.id,
        );

        expect(receiverUser).toEqual(expectedReceiverUser);

        expect(payerUserFound.balance).toEqual(
            payerUser.balance - transferData.value,
        );

        expect(receiverUserFound.balance).toEqual(
            receiverUser.balance + transferData.value,
        );
    });
});
