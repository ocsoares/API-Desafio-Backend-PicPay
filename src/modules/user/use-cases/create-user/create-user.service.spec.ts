import { Test, TestingModule } from '@nestjs/testing';
import { IUser } from '../../../../models/IUser';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { CreateUserService } from './create-user.service';
import { UserExistsByCpfException } from '../../../../exceptions/user-exceptions/user-exists-by-cpf.exception';
import { UserExistsByEmailException } from '../../../../exceptions/user-exceptions/user-exists-by-email.exception';
import * as bcrypt from 'bcrypt';
import { IReturnUser } from 'src/interfaces/return-to-request/IReturnUser';

describe('CreateUserService', () => {
    let createUserService: CreateUserService;
    let userRepository: UserRepository;

    const userData: IUser = {
        role: 'user',
        full_name: 'Lucas Roberto',
        cpf: '482.935.470-49',
        email: 'lucasroberto@gmail.com',
        password: 'lucasroberto123',
    };

    const cpfWithoutPunctuation = '48293547049';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateUserService,
                {
                    provide: UserRepository,
                    useValue: {
                        findByCPF: jest.fn(),
                        findByEmail: jest.fn(),
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        createUserService = module.get<CreateUserService>(CreateUserService);
        userRepository = module.get<UserRepository>(UserRepository);

        jest.spyOn(createUserService, 'execute');
    });

    it('should be defined', () => {
        expect(createUserService).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    it('should NOT create a user if user by CPF exists', async () => {
        (userRepository.findByCPF as jest.Mock).mockResolvedValue({} as IUser);

        await expect(createUserService.execute(userData)).rejects.toThrow(
            new UserExistsByCpfException(),
        );

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

        await expect(createUserService.execute(userData)).rejects.toThrow(
            new UserExistsByEmailException(),
        );

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

        (userRepository.create as jest.Mock).mockResolvedValue(createData);

        const createUser = await createUserService.execute(userData);

        const returnData: IReturnUser = {
            role: createData.role,
            full_name: createData.full_name,
            email: createData.email,
        };

        const isValidEncryptedPassword = await bcrypt.compare(
            userData.password,
            createData.password,
        );

        expect(createUserService.execute).toHaveBeenCalledWith(userData);
        expect(userRepository.findByCPF).toHaveBeenCalledWith(
            cpfWithoutPunctuation,
        );
        expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
        expect(userRepository.create).toHaveBeenCalledWith({
            ...createData,
            password: expect.any(String),
        });
        expect(createUser).toEqual(returnData);
        expect(isValidEncryptedPassword).toBe(true);
    });
});
