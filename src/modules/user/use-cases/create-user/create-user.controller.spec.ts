import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDependenciesModule } from '../../../../modules/test/test-dependencies.module';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { CreateUserService } from './create-user.service';
import * as supertest from 'supertest';

describe('CreateUserController', () => {
    let app: INestApplication;
    let createUserService: CreateUserService;
    let userRepository: UserRepository;
    const route = '/auth/register';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [TestDependenciesModule],
        }).compile();

        app = module.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );

        createUserService = module.get<CreateUserService>(CreateUserService);
        userRepository = module.get<UserRepository>(UserRepository);

        await app.init();
    });

    afterEach(async () => {
        await app.close();
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
        expect(createUserService).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    it('should create a user', async () => {
        const userData = {
            full_name: 'Lucas Roberto',
            cpf: '482.935.470-49',
            email: 'lucasroberto@gmail.com',
            password: 'lucasroberto123',
        };

        const response = await supertest(app.getHttpServer())
            .post(route)
            .send(userData);

        console.log('RESPONSE:', response.body);
    });
});
