import { Injectable } from '@nestjs/common';
import { IService } from 'src/interfaces/IService';
import { IReturnUser } from 'src/interfaces/return-to-body/IReturnUser';
import { IUser } from 'src/models/IUser';
import { UserExistsByCpfException } from 'src/exceptions/user-exceptions/user-exists-by-cpf.exception';
import { UserExistsByEmailException } from 'src/exceptions/user-exceptions/user-exists-by-email.exception';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserService implements IService {
    constructor(private readonly _createUserRepository: UserRepository) {}

    async execute(data: IUser): Promise<IReturnUser> {
        const findUserByCPF = await this._createUserRepository.findByCPF(
            data.cpf,
        );

        if (findUserByCPF) {
            throw new UserExistsByCpfException();
        }

        const findUserByEmail = await this._createUserRepository.findByEmail(
            data.email,
        );

        if (findUserByEmail) {
            throw new UserExistsByEmailException();
        }

        const createUser = await this._createUserRepository.create({
            ...data,
            password: await bcrypt.hash(data.password, 10),
            balance: 0,
        });

        const returnToBody: IReturnUser = {
            full_name: createUser.email,
            email: createUser.email,
        };

        return returnToBody;
    }
}
