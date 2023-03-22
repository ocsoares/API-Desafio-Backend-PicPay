import { Injectable } from '@nestjs/common';
import { IService } from '../../../../interfaces/IService';
import { IReturnUser } from '../../../../interfaces/return-to-request/IReturnUser';
import { IUser } from '../../../../models/IUser';
import { UserExistsByCpfException } from '../../../../exceptions/user-exceptions/user-exists-by-cpf.exception';
import { UserExistsByEmailException } from '../../../../exceptions/user-exceptions/user-exists-by-email.exception';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import * as bcrypt from 'bcrypt';
import { cpf } from 'cpf-cnpj-validator';

@Injectable()
export class CreateUserService implements IService {
    constructor(private readonly _createUserRepository: UserRepository) {}

    async execute(data: IUser): Promise<IReturnUser> {
        const formattedCPF = cpf.strip(data.cpf); // Remove CPF punctuation if it exists

        const findUserByCPF = await this._createUserRepository.findByCPF(
            formattedCPF,
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
            cpf: formattedCPF,
            password: await bcrypt.hash(data.password, 10),
            balance: 0,
        });

        const returnToBody: IReturnUser = {
            full_name: createUser.full_name,
            email: createUser.email,
        };

        return returnToBody;
    }
}
