import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { CreateUserService } from './create-user.service';
import { CreateUserDTO } from './dtos/CreateUserDTO';
import { IUser } from 'src/models/IUser';
import * as bcrypt from 'bcrypt';
import { TestDependenciesModule } from '../../../../modules/test/test-dependencies.module';

describe('UserController', () => {
    let app: INestApplication;
    let userService: CreateUserService;
    let repository: UserRepository;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [TestDependenciesModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        // PRECISA Habilitar Novamente as Verificações do Body da Aplicação, igual no main.ts !!!
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );

        userService = moduleFixture.get<CreateUserService>(CreateUserService);
        repository = moduleFixture.get<UserRepository>(UserRepository);

        // Para Mockar FUNÇÕES, é necessário usar jest.spyOn(), seguido da Variável que tem a/as Função(s) + Função
        // a ser Mockada !!
        // OBS: Para MÉTODOS, por exemplo os do UserRepository, usar o jest.fn() !!!
        // IMPORTANTE: Nesse caso, o userService.execute() é responsável por Fornecer os DADOS do Usuário Criado,
        // no objeto data !!!
        jest.spyOn(userService, 'execute');
        jest.spyOn(repository, 'create');

        await app.init();
    });

    afterEach(async () => {
        await app.close();
        jest.clearAllMocks(); // Como os Valores do Mock estão sendo Atribuidos INDIVIDUALMENTE nos Escopos de cada Teste,
        // esse jest.clearAllMocks() NÃO está sendo utilizado !!!
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
        expect(userService).toBeDefined();
        expect(repository).toBeDefined();
    });

    it('should create a new user', async () => {
        const userData: CreateUserDTO = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'johndoe123',
        };

        const expectedBodyResponse = {
            name: userData.name,
            email: userData.email,
        };

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(userData)
            .expect(201);

        const createdUser = await repository.findByEmail(userData.email);

        const isValidEncryptedPassword = await bcrypt.compare(
            userData.password,
            createdUser.password,
        );

        expect(response.body.data).toEqual(expectedBodyResponse);
        expect(isValidEncryptedPassword).toBe(true);
        expect(repository.create).toHaveBeenCalledWith({
            ...userData,
            password: createdUser.password,
        });
        expect(userService.execute).toHaveBeenCalledTimes(1);
        expect(userService.execute).toHaveBeenCalledWith(userData);
    });

    it('should NOT create a new user if the body is invalid', async () => {
        const userData: any = {
            name: 84934032,
            email: 'johndoe@.example_.com',
            password: 1234,
            extrafield: 'extra',
        };

        const expectedMessage = [
            'property extrafield should not exist',
            'name must be a string',
            'Insira um email válido !',
            'password must be longer than or equal to 7 and shorter than or equal to 120 characters',
            'password must be a string',
        ];

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(userData)
            .expect(400);

        expect(response.body.message).toEqual(expectedMessage);
        expect(userService.execute).toHaveBeenCalledTimes(0); // Como o Body é inválido, o Service NÃO é chamado !!
        expect(userService.execute).not.toHaveBeenCalledWith(userData); // Mesma coisa do de cima, NÃO será retornado as Info do Usuário !!
    });

    it('should NOT create a user if the name already exists', async () => {
        jest.spyOn(repository, 'findByName').mockResolvedValue({} as IUser);

        const userData: CreateUserDTO = {
            name: 'John Doe Jr',
            email: 'johndoejr@example.com',
            password: 'johndoejr123',
        };

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(userData)
            .expect(400);

        expect(response.body.message).toEqual(
            'Já existe um usuário cadastrado com esse nome !',
        );
        expect(userService.execute).toHaveBeenCalledTimes(1);
        expect(userService.execute).toHaveBeenCalledWith(userData);
    });

    it('should NOT create a user if the email already exists', async () => {
        jest.spyOn(repository, 'findByEmail').mockResolvedValue({} as IUser);

        const userData: CreateUserDTO = {
            name: 'John Doe Sr',
            email: 'johndoesr@example.com',
            password: 'johndoesr123',
        };

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(userData)
            .expect(400);

        expect(response.body.message).toEqual(
            'Já existe um usuário cadastrado com esse email !',
        );
        expect(userService.execute).toHaveBeenCalledTimes(1);
        expect(userService.execute).toHaveBeenCalledWith(userData);
    });
});
