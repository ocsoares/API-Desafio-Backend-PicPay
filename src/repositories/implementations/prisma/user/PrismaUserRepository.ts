import { Injectable } from '@nestjs/common';
import { IUser } from 'src/models/IUser';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';
import { PrismaService } from '../prisma-client.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private readonly _prismaService: PrismaService) {}

    async create(data: IUser): Promise<IUser> {
        const createUser = await this._prismaService.user.create({
            data: {
                ...data,
                balance: data.balance, // Como é Opcional, estava dando ERRO
            },
        });

        return createUser;
    }

    async findByEmail(email: string): Promise<IUser> {
        const findByEmail = await this._prismaService.user.findUnique({
            where: { email },
        });

        return findByEmail;
    }

    async findByCPF(cpf: string): Promise<IUser> {
        const findByCPF = await this._prismaService.user.findUnique({
            where: { cpf },
        });

        return findByCPF;
    }
}
