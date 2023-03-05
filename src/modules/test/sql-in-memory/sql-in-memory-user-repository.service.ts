import { Injectable } from '@nestjs/common';
import { IUser } from '../../../models/IUser';
import { UserRepository } from '../../../repositories/abstracts/UserRepository';

@Injectable()
export class SQLInMemoryUserRepository implements UserRepository {
    private users: IUser[] = [];

    async create(data: IUser): Promise<IUser> {
        const newUser = { ...data };

        this.users.push(newUser);

        return newUser;
    }

    async findByEmail(email: string): Promise<IUser> {
        const user = this.users.find((user) => user.email === email);

        return user;
    }

    async findByCPF(cpf: string): Promise<IUser> {
        const user = this.users.find((user) => user.cpf === cpf);

        return user;
    }
}
