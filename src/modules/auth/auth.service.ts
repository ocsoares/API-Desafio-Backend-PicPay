import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/abstracts/UserRepository';
import * as bcrypt from 'bcrypt';
import { IReturnUser } from 'src/interfaces/return-to-request/IReturnUser';
import { InvalidUserLoginException } from '../../exceptions/user-exceptions/invalid-user-login.exception';

interface IAuthService {
    validateUser(email: string, password: string): Promise<IReturnUser>;
}

@Injectable()
export class AuthService implements IAuthService {
    constructor(private readonly _authUserRepository: UserRepository) {}

    async validateUser(email: string, password: string): Promise<IReturnUser> {
        const user = await this._authUserRepository.findByEmail(email);

        if (!user) {
            throw new InvalidUserLoginException();
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new InvalidUserLoginException();
        }

        // eslint-disable-next-line prettier/prettier, @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
        const { password:_, ...returnUser } = user

        return returnUser as IReturnUser;
    }
}
