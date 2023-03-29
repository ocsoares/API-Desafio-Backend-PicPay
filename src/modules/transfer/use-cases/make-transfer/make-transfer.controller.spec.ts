import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { TestDependenciesModule } from '../../../../modules/test/test-dependencies.module';
import * as supertest from 'supertest';
import { SendNotifyService } from '../../../../providers/send-notify/send-notify.service';
import { TransferAuthorizerService } from '../../../../providers/transfer-authorizer/transfer-authorizer.service';
import { NotifyRepository } from '../../../../repositories/abstracts/NotifyRepository';
import { TransferRepository } from '../../../../repositories/abstracts/TransferRepository';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { MakeTransferService } from './make-transfer.service';
import { MakeTransferDTO } from './dtos/MakeTransferDTO';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../../../../modules/auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../../../../modules/auth/guards/jwt-auth.guard';
import { IUserPayload } from '../../../../modules/auth/models/IUserPayload';
import { ITransfer } from '../../../../models/ITransfer';
import { invalidUserByIdExceptionMessage } from '../../../../exceptions/user-exceptions/invalid-user-by-id.exception';
import { IUser } from '../../../../models/IUser';
import { unauthorizedRoleTransferExceptionMessage } from '../../../../exceptions/transfer-exceptions/unauthorized-role-transfer.exception';
import { invalidEmailTransferExceptionMessage } from '../../../../exceptions/transfer-exceptions/invalid-email-transfer.exception';
import { transferToOwnEmailExceptionMessage } from '../../../../exceptions/transfer-exceptions/transfer-to-own-email.exception';
import { insufficientBalanceExceptionMessage } from '../../../../exceptions/transfer-exceptions/insufficient-balance.exception';
import { transferErrorExceptionMessage } from '../../../../exceptions/transfer-exceptions/transfer-error.exception';
import { INotify } from '../../../../models/INotify';

describe('MakeTransferController', () => {
    let app: INestApplication;
    let makeTransferService: MakeTransferService;
    let transferAuthorizerService: TransferAuthorizerService;
    let sendNotifyService: SendNotifyService;
    let transferRepository: TransferRepository;
    let userRepository: UserRepository;
    let notifyRepository: NotifyRepository;
    let jwtService: JwtService;
    let JWT: string;
    const route = '/transfer';

    const payload: IUserPayload = {
        sub: 'any_id',
        role: 'user',
        full_name: 'any_name',
        email: 'any_email',
    };

    const transferBody: MakeTransferDTO = {
        to_user_email: 'testemail@gmail.com',
        value: 120,
    };

    const transferBodyWithAccountId: ITransfer = {
        ...transferBody,
        account_id: payload.sub,
    };

    const user: IUser = {
        id: payload.sub,
        role: 'user',
        full_name: 'any_name',
        cpf: '261.398.680-84',
        email: 'anyemail@gmail.com',
        password: 'anypassword123',
        balance: 0,
    };

    const userPositiveBalance: IUser = {
        ...user,
        balance: 215.37,
    };

    const userReceiver: IUser = {
        id: 'receiver_id',
        role: 'shopkeeper', // Tanto faz user ou shopkeeper, ambos podem receber
        full_name: 'receiver_name',
        cpf: '531.784.000-79',
        email: 'receiveremail@gmail.com',
        password: 'receiverpassword123',
        balance: 0,
    };

    const sendNotifyData: INotify = {
        payer_name: userPositiveBalance.full_name,
        payer_cpf: userPositiveBalance.cpf,
        transfer_amount: transferBody.value,
        transfer_time: expect.any(Date),
        to_user_id: userReceiver.id,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: process.env.JWT_EXPIRATION_TEST },
                }),
                TestDependenciesModule,
            ],
            providers: [
                JwtStrategy,
                JwtService,
                {
                    provide: APP_GUARD,
                    useClass: JwtAuthGuard,
                },
            ],
        }).compile();

        app = module.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );

        makeTransferService =
            module.get<MakeTransferService>(MakeTransferService);

        transferAuthorizerService = module.get<TransferAuthorizerService>(
            TransferAuthorizerService,
        );

        sendNotifyService = module.get<SendNotifyService>(SendNotifyService);
        transferRepository = module.get<TransferRepository>(TransferRepository);
        userRepository = module.get<UserRepository>(UserRepository);
        notifyRepository = module.get<NotifyRepository>(NotifyRepository);
        jwtService = module.get<JwtService>(JwtService);

        jest.spyOn(jwtService, 'sign');
        jest.spyOn(makeTransferService, 'execute');
        jest.spyOn(userRepository, 'findById');
        jest.spyOn(userRepository, 'findByEmail');
        jest.spyOn(transferAuthorizerService, 'execute');
        jest.spyOn(transferRepository, 'transfer');
        jest.spyOn(notifyRepository, 'send');
        jest.spyOn(sendNotifyService, 'execute');

        JWT = jwtService.sign(payload);

        await app.init();
    });

    afterEach(async () => {
        await app.close();
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
        expect(makeTransferService).toBeDefined();
        expect(transferAuthorizerService).toBeDefined();
        expect(sendNotifyService).toBeDefined();
        expect(transferRepository).toBeDefined();
        expect(userRepository).toBeDefined();
        expect(notifyRepository).toBeDefined();
        expect(jwtService).toBeDefined();
    });

    it('should generate a valid JWT for tests', () => {
        expect(JWT).toEqual(expect.any(String));
        expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });

    it('should NOT make a transfer if the request body data is invalid', async () => {
        const invalidTransferBody = {
            to_user_email: 'invalid_email11_',
            value: 'two',
            fruit: 'apple',
            region: '',
        };

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(invalidTransferBody)
            .expect(400);

        const { message } = response.body;

        const expectedMessage = [
            'property fruit should not exist',
            'property region should not exist',
            'to_user_email must be an email',
            'value must have at most two decimal places',
            'value must be a positive number',
        ];

        expect(message).toEqual(expectedMessage);
        expect(makeTransferService.execute).toHaveBeenCalledTimes(0);
        expect(userRepository.findById).toHaveBeenCalledTimes(0);
        expect(userRepository.findByEmail).toHaveBeenCalledTimes(0);
        expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
        expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
        expect(notifyRepository.send).toHaveBeenCalledTimes(0);
        expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
    });

    it('should NOT make a transfer if the JWT is invalid', async () => {
        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer invalid_jwt`)
            .send(transferBody)
            .expect(401);

        const { message } = response.body;

        expect(message).toEqual('Invalid or expired token !');

        expect(makeTransferService.execute).toHaveBeenCalledTimes(0);
        expect(userRepository.findById).toHaveBeenCalledTimes(0);
        expect(userRepository.findByEmail).toHaveBeenCalledTimes(0);
        expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
        expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
        expect(notifyRepository.send).toHaveBeenCalledTimes(0);
        expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
    });

    it(`should NOT make a transfer if JWT user by id doesn't exists`, async () => {
        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(transferBody)
            .expect(400);

        const { message } = response.body;

        expect(message).toEqual(invalidUserByIdExceptionMessage);

        expect(makeTransferService.execute).toHaveBeenCalledWith(
            transferBodyWithAccountId,
        );

        expect(userRepository.findById).toHaveBeenCalledWith(payload.sub);

        expect(userRepository.findByEmail).toHaveBeenCalledTimes(0);
        expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
        expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
        expect(notifyRepository.send).toHaveBeenCalledTimes(0);
        expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
    });

    it('should NOT make a transfer if user role is shopkeeper', async () => {
        const userShopkeeper: IUser = {
            id: payload.sub,
            role: 'shopkeeper',
            full_name: 'any_name',
            cpf: '261.398.680-84',
            email: 'anyemail@gmail.com',
            password: 'anypassword123',
            balance: 0,
        };

        jest.spyOn(userRepository, 'findById').mockResolvedValue(
            userShopkeeper,
        );

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(transferBody)
            .expect(401);

        const { message } = response.body;

        expect(message).toEqual(unauthorizedRoleTransferExceptionMessage);

        expect(makeTransferService.execute).toHaveBeenCalledWith(
            transferBodyWithAccountId,
        );

        expect(userRepository.findById).toHaveBeenCalledWith(payload.sub);

        expect(userRepository.findByEmail).toHaveBeenCalledTimes(0);
        expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
        expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
        expect(notifyRepository.send).toHaveBeenCalledTimes(0);
        expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
    });

    it('should NOT make a transfer if the user email is invalid', async () => {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(user);

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(transferBody)
            .expect(400);

        const { message } = response.body;

        expect(message).toEqual(invalidEmailTransferExceptionMessage);

        expect(makeTransferService.execute).toHaveBeenCalledWith(
            transferBodyWithAccountId,
        );

        expect(userRepository.findById).toHaveBeenCalledWith(payload.sub);

        expect(userRepository.findByEmail).toHaveBeenCalledWith(
            transferBody.to_user_email,
        );

        expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
        expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
        expect(notifyRepository.send).toHaveBeenCalledTimes(0);
        expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
    });

    it(`should NOT make a transfer if the payee's email is the same as the payer's`, async () => {
        const userSameEmail: IUser = {
            ...user,
            email: transferBody.to_user_email,
        };

        jest.spyOn(userRepository, 'findById').mockResolvedValue(userSameEmail);
        jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(transferBody)
            .expect(400);

        const { message } = response.body;

        expect(message).toEqual(transferToOwnEmailExceptionMessage);

        expect(makeTransferService.execute).toHaveBeenCalledWith(
            transferBodyWithAccountId,
        );

        expect(userRepository.findById).toHaveBeenCalledWith(payload.sub);

        expect(userRepository.findByEmail).toHaveBeenCalledWith(
            transferBody.to_user_email,
        );

        expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
        expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
        expect(notifyRepository.send).toHaveBeenCalledTimes(0);
        expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
    });

    it(`should NOT make a transfer if the payer's balance is equal to zero`, async () => {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
        jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(
            userReceiver,
        );

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(transferBody)
            .expect(402);

        const { message } = response.body;

        expect(message).toEqual(insufficientBalanceExceptionMessage);

        expect(makeTransferService.execute).toHaveBeenCalledWith(
            transferBodyWithAccountId,
        );

        expect(userRepository.findById).toHaveBeenCalledWith(payload.sub);

        expect(userRepository.findByEmail).toHaveBeenCalledWith(
            transferBody.to_user_email,
        );

        expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
        expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
        expect(notifyRepository.send).toHaveBeenCalledTimes(0);
        expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
    });

    it(`should NOT make a transfer if the payer's balance is less than zero`, async () => {
        const userBalanceLessThanZero: IUser = {
            ...user,
            balance: -208.31,
        };

        jest.spyOn(userRepository, 'findById').mockResolvedValue(
            userBalanceLessThanZero,
        );
        jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(
            userReceiver,
        );

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(transferBody)
            .expect(402);

        const { message } = response.body;

        expect(message).toEqual(insufficientBalanceExceptionMessage);

        expect(makeTransferService.execute).toHaveBeenCalledWith(
            transferBodyWithAccountId,
        );

        expect(userRepository.findById).toHaveBeenCalledWith(payload.sub);

        expect(userRepository.findByEmail).toHaveBeenCalledWith(
            transferBody.to_user_email,
        );

        expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
        expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
        expect(notifyRepository.send).toHaveBeenCalledTimes(0);
        expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
    });

    it(`should NOT make a transfer if the payer's balance after the transfer is less than zero`, async () => {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(
            userPositiveBalance,
        );

        jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(
            userReceiver,
        );

        const sendMoreAvailableBalance = userPositiveBalance.balance + 1;

        const transferBodySendMoreAvailableBalance: MakeTransferDTO = {
            ...transferBody,
            value: sendMoreAvailableBalance,
        };

        const transferBodySendMoreAvailableBalanceWithAccountId: ITransfer = {
            ...transferBodySendMoreAvailableBalance,
            account_id: payload.sub,
        };

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(transferBodySendMoreAvailableBalance)
            .expect(402);

        const { message } = response.body;

        expect(message).toEqual(insufficientBalanceExceptionMessage);

        expect(makeTransferService.execute).toHaveBeenCalledWith(
            transferBodySendMoreAvailableBalanceWithAccountId,
        );

        expect(userRepository.findById).toHaveBeenCalledWith(payload.sub);

        expect(userRepository.findByEmail).toHaveBeenCalledWith(
            transferBody.to_user_email,
        );

        expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
        expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
        expect(notifyRepository.send).toHaveBeenCalledTimes(0);
        expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
    });

    it('should NOT make a transfer if unauthorized by external API', async () => {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(
            userPositiveBalance,
        );

        jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(
            userReceiver,
        );

        jest.spyOn(transferAuthorizerService, 'execute').mockResolvedValue(
            'Unauthorized',
        );

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(transferBody)
            .expect(500);

        const { message } = response.body;

        expect(message).toEqual(transferErrorExceptionMessage);

        expect(makeTransferService.execute).toHaveBeenCalledWith(
            transferBodyWithAccountId,
        );

        expect(userRepository.findById).toHaveBeenCalledWith(payload.sub);

        expect(userRepository.findByEmail).toHaveBeenCalledWith(
            transferBody.to_user_email,
        );

        await expect(transferAuthorizerService.execute()).resolves.toEqual(
            'Unauthorized',
        );

        expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
        expect(notifyRepository.send).toHaveBeenCalledTimes(0);
        expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
    });

    it(`should NOT make a transfer if notification isn't sent by external API`, async () => {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(
            userPositiveBalance,
        );

        jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(
            userReceiver,
        );

        // NÃO mockei o "transferAuthorizerService" aqui para ele fazer a Requisição REAL !!

        jest.spyOn(sendNotifyService, 'execute').mockResolvedValue('Not sent');

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(transferBody)
            .expect(500);

        const { message } = response.body;

        expect(message).toEqual(transferErrorExceptionMessage);

        expect(makeTransferService.execute).toHaveBeenCalledWith(
            transferBodyWithAccountId,
        );

        expect(userRepository.findById).toHaveBeenCalledWith(payload.sub);

        expect(userRepository.findByEmail).toHaveBeenCalledWith(
            transferBody.to_user_email,
        );

        await expect(transferAuthorizerService.execute()).resolves.toEqual(
            'Autorizado',
        );

        expect(transferRepository.transfer).toHaveBeenCalledWith(
            transferBodyWithAccountId,
        );

        expect(notifyRepository.send).toHaveBeenCalledWith(sendNotifyData);

        await expect(sendNotifyService.execute()).resolves.toEqual('Not sent');
    });

    it('should make a transfer', async () => {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(
            userPositiveBalance,
        );

        jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(
            userReceiver,
        );

        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(transferBody)
            .expect(200);

        const { message } = response.body;

        expect(message).toEqual(
            `Transferência realizada com sucesso no valor de R$${transferBody.value} para o usuário de email ${transferBody.to_user_email} !`,
        );

        expect(makeTransferService.execute).toHaveBeenCalledWith(
            transferBodyWithAccountId,
        );

        expect(userRepository.findById).toHaveBeenCalledWith(payload.sub);

        expect(userRepository.findByEmail).toHaveBeenCalledWith(
            transferBody.to_user_email,
        );

        await expect(transferAuthorizerService.execute()).resolves.toEqual(
            'Autorizado',
        );

        expect(transferRepository.transfer).toHaveBeenCalledWith(
            transferBodyWithAccountId,
        );

        expect(notifyRepository.send).toHaveBeenCalledWith(sendNotifyData);

        await expect(sendNotifyService.execute()).resolves.toEqual('Success');
    }, 25000);
    // Como a requisição da API externa de notificação demora um pouco, tive que
    // aumentar para 25 segundos de espera máxima para esse teste passar !
});
