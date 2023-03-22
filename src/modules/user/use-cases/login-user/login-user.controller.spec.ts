import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { LoginUserController } from './login-user.controller';
import { LoginUserService } from './login-user.service';
import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../../../auth/strategies/local.strategy';
import { AuthService } from '../../../auth/auth.service';
import { IUser } from 'src/models/IUser';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigModule } from '@nestjs/config';
import { LoginValidationBodyModule } from '../../../login-validation-body/login-validation-body.module';
import { LoginRequestBody } from 'src/modules/auth/models/LoginRequestBody';
import { invalidUserLoginExceptionMessage } from '../../../../exceptions/user-exceptions/invalid-user-login.exception';

describe('LoginUserController', () => {
    let app: INestApplication;
    let repository: UserRepository;
    let service: LoginUserService;
    let bcryptCompare: jest.SpyInstance;
    const route = '/auth/login';

    const user: IUser = {
        id: 'any_id',
        full_name: 'Teste',
        email: 'teste@gmail.com',
        cpf: '822.850.530-29',
        password: 'teste123',
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPass } = user;

    const loginBody: LoginRequestBody = {
        email: 'teste@gmail.com',
        password: 'teste123',
    };

    // TENTAR fazer SEM MOCK, usando o Original com Chave secreta e useFacory talvez...

    // Classe mockada com uma Chave Secreta, porque por algum motivo esse Método em LoginUserService NÃO
    // estava ativando a Chave Secreta !!!
    // OBS: Colocar essa Classe em useClass abaixo de provide: JwtService !!
    class JwtServiceMock extends JwtService {
        private readonly _secretKey = process.env.JWT_SECRET;

        sign(
            payload: string | object | Buffer,
            options?: JwtSignOptions,
        ): string {
            return jwt.sign(payload, this._secretKey, options);
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                PassportModule.register({ defaultStrategy: 'local' }),
                LoginValidationBodyModule,
            ],
            controllers: [LoginUserController],
            providers: [
                LoginUserService,
                {
                    provide: JwtService,
                    useClass: JwtServiceMock,
                },
                {
                    provide: UserRepository,
                    useValue: {
                        findByEmail: jest.fn(),
                    },
                },
                LocalStrategy,
                AuthService,
            ],
        }).compile();

        app = module.createNestApplication();

        repository = module.get<UserRepository>(UserRepository);
        service = module.get<LoginUserService>(LoginUserService);

        jest.spyOn(service, 'execute');
        bcryptCompare = jest.spyOn(bcrypt, 'compare');

        await app.init();
    });

    afterEach(async () => {
        await app.close();
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
        expect(repository).toBeDefined();
        expect(service).toBeDefined();
        expect(bcryptCompare).toBeDefined();
    });

    it('should NOT generate a JWT if the body is invalid', async () => {
        const invalidLoginBody = {
            apple: 'anything',
            orange: 'sometime',
        };

        const response = await supertest(app.getHttpServer())
            .post(route)
            .send(invalidLoginBody)
            .expect(400);

        const { message } = response.body;
        const expectedMessage = [
            'email must be an email',
            'email should not be empty',
            'password must be a string',
            'password should not be empty',
        ];

        expect(message).toEqual(expectedMessage);
        expect(service.execute).toHaveBeenCalledTimes(0);
        expect(repository.findByEmail).toHaveBeenCalledTimes(0);
        expect(bcryptCompare).toHaveBeenCalledTimes(0);
    });

    it('should NOT generate a JWT for a invalid user', async () => {
        const response = await supertest(app.getHttpServer())
            .post(route)
            .send(loginBody)
            .expect(401);

        const { message } = response.body;

        expect(message).toEqual(invalidUserLoginExceptionMessage);
        expect(repository.findByEmail).toHaveBeenCalledWith(loginBody.email);
        expect(bcryptCompare).toHaveBeenCalledTimes(0);
        expect(service.execute).toHaveBeenCalledTimes(0);
    });

    it('should generate a JWT for a valid user', async () => {
        (repository.findByEmail as jest.Mock).mockResolvedValue(user);
        bcryptCompare.mockResolvedValue(true);

        const response = await supertest(app.getHttpServer())
            .post(route)
            .send(loginBody)
            .expect(200);

        const JWT = response.body.data;

        expect(JWT).toEqual(expect.any(String));
        expect(repository.findByEmail).toHaveBeenCalledWith(loginBody.email);
        expect(service.execute).toHaveBeenCalledWith(userWithoutPass);
        expect(bcryptCompare).toHaveBeenCalledWith(
            loginBody.password,
            user.password,
        );
    });
});
