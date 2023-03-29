import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import { JwtAuthGuard } from '../../../../modules/auth/guards/jwt-auth.guard';
import { IUserPayload } from '../../../../modules/auth/models/IUserPayload';
import { JwtStrategy } from '../../../../modules/auth/strategies/jwt.strategy';
import { TestDependenciesModule } from '../../../../modules/test/test-dependencies.module';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import * as supertest from 'supertest';
import { MeUserService } from './me-user.service';
import { invalidUserByIdExceptionMessage } from '../../../../exceptions/user-exceptions/invalid-user-by-id.exception';
import { IUser } from '../../../../models/IUser';

describe('MeUserController', () => {
    let app: INestApplication;
    let meUserService: MeUserService; // any = Service
    let userRepository: UserRepository; // any = Repository
    let jwtService: JwtService;
    let JWT: string;
    const route = '/auth/me';

    const payload: IUserPayload = {
        sub: 'any_id',
        role: 'user',
        full_name: 'any_name',
        email: 'any_email',
    };

    const user: IUser = {
        id: 'user-id',
        role: 'user',
        full_name: 'any_name',
        cpf: '261.398.680-84',
        email: 'anyemail@gmail.com',
        password: 'anypassword123',
        balance: 0,
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

        meUserService = module.get<MeUserService>(MeUserService);
        userRepository = module.get<UserRepository>(UserRepository);
        jwtService = module.get<JwtService>(JwtService);

        jest.spyOn(jwtService, 'sign');
        jest.spyOn(meUserService, 'execute');
        jest.spyOn(userRepository, 'findById');

        JWT = jwtService.sign(payload);

        await app.init();
    });

    afterEach(async () => {
        await app.close();
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
        expect(meUserService).toBeDefined();
        expect(userRepository).toBeDefined();
        expect(jwtService).toBeDefined();
    });

    it('should generate a valid JWT for tests', () => {
        expect(JWT).toEqual(expect.any(String));
        expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });

    it('should NOT show authenticated user if the JWT is invalid', async () => {
        const response = await supertest(app.getHttpServer())
            .get(route)
            .set('Authorization', `Bearer invalid_jwt`)
            .expect(401);

        const { message } = response.body;

        expect(message).toEqual('Invalid or expired token !');
        expect(meUserService.execute).toHaveBeenCalledTimes(0);
        expect(userRepository.findById).toHaveBeenCalledTimes(0);
    });

    it(`should NOT show authenticated user if token user by id doesn't exists in database`, async () => {
        const response = await supertest(app.getHttpServer())
            .get(route)
            .set('Authorization', `Bearer ${JWT}`)
            .expect(400);

        const { message } = response.body;

        expect(message).toEqual(invalidUserByIdExceptionMessage);
        expect(meUserService.execute).toHaveBeenCalledWith(payload.sub);
        expect(userRepository.findById).toHaveBeenCalledWith(payload.sub);
    });

    it('should show authenticated user', async () => {
        jest.spyOn(userRepository, 'findById').mockResolvedValue(user);

        const response = await supertest(app.getHttpServer())
            .get(route)
            .set('Authorization', `Bearer ${JWT}`)
            .expect(200);

        const { message } = response.body;

        expect(message).toEqual(`${user.full_name} autenticado !`);
        expect(meUserService.execute).toHaveBeenCalledWith(payload.sub);
        expect(userRepository.findById).toHaveBeenCalledWith(payload.sub);
    });
});
