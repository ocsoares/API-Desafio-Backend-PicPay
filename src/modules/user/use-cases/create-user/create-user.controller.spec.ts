import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDependenciesModule } from '../../../../modules/test/test-dependencies.module';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { CreateUserService } from './create-user.service';
import { IUser } from '../../../../models/IUser';
import * as supertest from 'supertest';
import { cpfExceptionMessage } from '../../../../exceptions/user-exceptions/user-exists-by-cpf.exception';
import { CreateUserDTO } from './dtos/CreateUserDTO';
import { emailExceptionMessage } from '../../../../exceptions/user-exceptions/user-exists-by-email.exception';
import { IReturnUser } from '../../../../interfaces/return-to-request/IReturnUser';
import * as bcrypt from 'bcrypt';

describe('CreateUserController', () => {
    let app: INestApplication;
    let createUserService: CreateUserService;
    let userRepository: UserRepository;
    const route = '/auth/register';

    const userData: CreateUserDTO = {
        role: 'shopkeeper',
        full_name: 'Lucas Roberto',
        cpf: '927.044.150-48',
        email: 'lucasroberto@gmail.com',
        password: 'lucasroberto123',
    };

    const cpfWithoutPunctuation = '92704415048';

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

        jest.spyOn(createUserService, 'execute');
        jest.spyOn(userRepository, 'findByCPF');
        jest.spyOn(userRepository, 'findByEmail');
        jest.spyOn(userRepository, 'create');

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

    it('should NOT create a user if body data is invalid', async () => {
        const invalidUserData = {
            full_nadsdsme: 'Lucas Roberto',
            cpf: '482.5.-4704dds9',
            email: 'lucasroberto@@gmail._com',
            password: 801030,
            apple: 'fruit',
        };

        const response = await supertest(app.getHttpServer())
            .post(route)
            .send(invalidUserData)
            .expect(400);

        const expectedMessage = [
            'property full_nadsdsme should not exist',
            'property apple should not exist',
            'role must be one of the following values: user,shopkeeper',
            'role should not be empty',
            'full_name must be a string',
            'full_name should not be empty',
            'cpf must be a cpf',
            'email must be an email',
            'password must be a string',
        ];

        expect(response.body.message).toEqual(expectedMessage);
        expect(createUserService.execute).toHaveBeenCalledTimes(0);
        expect(userRepository.findByCPF).toHaveBeenCalledTimes(0);
        expect(userRepository.findByEmail).toHaveBeenCalledTimes(0);
        expect(userRepository.create).toHaveBeenCalledTimes(0);
    });

    it('should NOT create a user if CPF is invalid', async () => {
        const response = await supertest(app.getHttpServer())
            .post(route)
            .send({
                ...userData,
                cpf: '_92!7.04@%%4.-15asds048+',
            })
            .expect(400);

        const expectedMessage = ['cpf must be a cpf'];

        expect(response.body.message).toEqual(expectedMessage);
        expect(createUserService.execute).toHaveBeenCalledTimes(0);
        expect(userRepository.findByCPF).toHaveBeenCalledTimes(0);
        expect(userRepository.findByEmail).toHaveBeenCalledTimes(0);
        expect(userRepository.create).toHaveBeenCalledTimes(0);
    });

    it('should NOT create a user if user by CPF exists', async () => {
        (userRepository.findByCPF as jest.Mock).mockResolvedValue({} as IUser);

        const response = await supertest(app.getHttpServer())
            .post(route)
            .send(userData)
            .expect(400);

        expect(response.body.message).toEqual(cpfExceptionMessage);
        expect(createUserService.execute).toHaveBeenCalledWith(userData);
        expect(userRepository.findByCPF).toHaveBeenCalledWith(
            cpfWithoutPunctuation,
        );
        expect(userRepository.findByEmail).toHaveBeenCalledTimes(0);
        expect(userRepository.create).toHaveBeenCalledTimes(0);
    });

    it('should NOT create a user if user by email exists', async () => {
        (userRepository.findByEmail as jest.Mock).mockResolvedValue(
            {} as IUser,
        );

        const response = await supertest(app.getHttpServer())
            .post(route)
            .send(userData)
            .expect(400);

        expect(response.body.message).toEqual(emailExceptionMessage);
        expect(createUserService.execute).toHaveBeenCalledWith(userData);
        expect(userRepository.findByCPF).toHaveBeenCalledWith(
            cpfWithoutPunctuation,
        );
        expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
        expect(userRepository.create).toHaveBeenCalledTimes(0);
    });

    it('should create a user', async () => {
        const createData: IUser = {
            ...userData,
            cpf: cpfWithoutPunctuation,
            password: await bcrypt.hash(userData.password, 10),
            balance: 0,
        };

        const response = await supertest(app.getHttpServer())
            .post(route)
            .send(userData)
            .expect(201);

        const expectedBodyResponse: IReturnUser = {
            role: userData.role,
            full_name: userData.full_name,
            email: userData.email,
        };

        const isValidEncryptedPassword = await bcrypt.compare(
            userData.password,
            createData.password,
        );

        expect(response.body.data).toEqual(expectedBodyResponse);
        expect(createUserService.execute).toHaveBeenCalledWith(userData);
        expect(userRepository.findByCPF).toHaveBeenCalledWith(
            cpfWithoutPunctuation,
        );
        expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
        expect(userRepository.create).toHaveBeenCalledWith({
            ...createData,
            password: expect.any(String),
        });
        expect(isValidEncryptedPassword).toBe(true);
    });
});
