import { Test, TestingModule } from '@nestjs/testing';
import { IUser } from '../../../../models/IUser';
import { InvalidUserByIdException } from '../../../../exceptions/user-exceptions/invalid-user-by-id.exception';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { MeUserService } from './me-user.service';
import { IReturnMeUser } from 'src/interfaces/return-to-request/IReturnMeUser';

describe('MeUserService', () => {
    let meUserService: MeUserService;
    let userRepository: UserRepository;

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
            providers: [
                MeUserService,
                {
                    provide: UserRepository,
                    useValue: {
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        meUserService = module.get<MeUserService>(MeUserService);
        userRepository = module.get<UserRepository>(UserRepository);

        jest.spyOn(meUserService, 'execute');
    });

    it('should be defined', () => {
        expect(meUserService).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    it(`should NOT show authenticated user if token user by id doesn't exists in database`, async () => {
        const invalidTokenUserId = 'any_id';

        await expect(meUserService.execute(invalidTokenUserId)).rejects.toThrow(
            new InvalidUserByIdException(),
        );

        expect(userRepository.findById).toHaveBeenCalledWith(
            invalidTokenUserId,
        );
    });

    it('should show authenticated user', async () => {
        (userRepository.findById as jest.Mock).mockResolvedValue(user);

        const meUser: IReturnMeUser = {
            role: user.role,
            full_name: user.full_name,
            email: user.email,
            balance: user.balance,
        };

        const meUserServiceResult = await meUserService.execute(user.id);

        expect(meUserServiceResult).toEqual(meUser);
        expect(userRepository.findById).toHaveBeenCalledWith(user.id);
    });
});
