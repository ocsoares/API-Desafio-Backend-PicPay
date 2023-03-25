import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { TestDependenciesModule } from 'src/modules/test/test-dependencies.module';
import * as supertest from 'supertest';

describe('(EXAMPLE) CreateUserController', () => {
    let app: INestApplication;
    let createUserService: any; // any = Service
    let userRepository: any; // any = Repository
    const route = '/ROUTE...';

    // Global variables...

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

        createUserService = module.get<null /* Service */>(null /* Service */);
        userRepository = module.get<null /* Repository */>(
            null /* Repository */,
        );

        jest.spyOn(createUserService, 'execute');
        jest.spyOn(userRepository, 'method to mock');

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

    it('description for the test', async () => {
        const response = await supertest(app.getHttpServer())
            .post(route)
            .send(null /* Request body */)
            .expect(null /* Http Status Code */);

        // code...
    });
});
