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

    const transferBody: MakeTransferDTO = {
        to_user_email: 'testemail@gmail.com',
        value: 120,
    };

    const payload: IUserPayload = {
        sub: 'any_id',
        role: 'user',
        full_name: 'any_name',
        email: 'any_email',
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

    it('description for the test', async () => {
        const response = await supertest(app.getHttpServer())
            .post(route)
            .set('Authorization', `Bearer ${JWT}`)
            .send(transferBody);
        // .expect(200);

        console.log('RESPONSE:', response.body);

        // code...
    });
});
