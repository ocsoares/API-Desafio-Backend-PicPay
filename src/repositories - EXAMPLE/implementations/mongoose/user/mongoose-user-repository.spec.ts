import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { IUser } from 'src/models/IUser';
import { MongooseUserRepository } from './MongooseUserRepository';
import { User, UserSchema } from '../schemas/user.schema';
import { CreateUserDTO } from 'src/modules/user/use-cases/create-user/dtos/CreateUserDTO';

describe('MongooseUserRepository', () => {
    let userRepository: MongooseUserRepository;
    let createdUser: IUser;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env',
                }),
                MongooseModule.forRoot(process.env.TEST_ATLAS_URL_CONNECTION),
                MongooseModule.forFeature([
                    { name: User.name, schema: UserSchema },
                ]),
            ],
            providers: [MongooseUserRepository],
        }).compile();

        userRepository = module.get<MongooseUserRepository>(
            MongooseUserRepository,
        );

        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.TEST_ATLAS_URL_CONNECTION);
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    it('should be defined', () => {
        expect(userRepository).toBeDefined();
    });

    it('should create a user', async () => {
        const userData = {
            name: 'Teste',
            email: 'teste@gmail.com',
            password: 'teste123',
        };

        // Aqui pode usar expect.any nas Propriedades geradas pelo BANCO DE DADOS, porque elas
        // podem VARIAR !!!
        // OBS: Se os dados forem FIXOS, NÃO pode usar esses expect.any(), porque vai dar ERRO !!!
        const expectedUser = {
            ...userData,
            _id: expect.any(mongoose.Types.ObjectId),
            id: expect.any(mongoose.Types.ObjectId),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            __v: expect.any(Number),
        };

        createdUser = await userRepository.create(userData);

        expect(createdUser).toEqual(expectedUser);
    });

    it('should find a user by id', async () => {
        type User = CreateUserDTO & { _id: string };
        const createdUserWithMongoId = createdUser as User;

        const userById = await userRepository.findById(
            createdUserWithMongoId._id,
        );

        expect(userById).toEqual(createdUser);
    });

    it('should find a user by name', async () => {
        const userByName = await userRepository.findByName(createdUser.name);

        expect(userByName).toEqual(createdUser);
    });

    it('should find a user by email', async () => {
        const userByEmail = await userRepository.findByEmail(createdUser.email);

        expect(userByEmail).toEqual(createdUser);
    });
});
