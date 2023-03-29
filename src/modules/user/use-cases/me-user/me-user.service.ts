import { Injectable } from '@nestjs/common';
import { InvalidUserByIdException } from 'src/exceptions/user-exceptions/invalid-user-by-id.exception';
import { IService } from 'src/interfaces/IService';
import { IReturnMeUser } from 'src/interfaces/return-to-request/IReturnMeUser';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';

@Injectable()
export class MeUserService implements IService {
    constructor(private readonly _meUserRepository: UserRepository) {}

    async execute(token_user_id: string): Promise<IReturnMeUser> {
        const user = await this._meUserRepository.findById(token_user_id);

        if (!user) {
            throw new InvalidUserByIdException();
        }

        const meUser: IReturnMeUser = {
            role: user.role,
            full_name: user.full_name,
            email: user.email,
            balance: user.balance,
        };

        return meUser;
    }
}
