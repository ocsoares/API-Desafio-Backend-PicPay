import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories - EXAMPLE/abstracts/UserRepository';
import * as bcrypt from 'bcrypt';
import { IReturnUser } from 'src/interfaces/IReturnUser';

interface IAuthService {
    validateUser(email: string, password: string): Promise<IReturnUser>; // VER o Retorno disso...
}

// Colocar um Throw de Error aqui nesse Service, porque no local auth guard está configurado para o
// Método handleRequest Tratar esse Erro com throw new UnauthorizedException(), com a Mensagem passada AQUI
// no Throw de Error !!!

@Injectable()
export class AuthService implements IAuthService {
    constructor(private readonly _authUserRepository: UserRepository) {}

    async validateUser(email: string, password: string): Promise<IReturnUser> {
        const user = await this._authUserRepository.findByEmail(email);

        if (!user) {
            throw new Error('Email ou senha incorreto(s) !');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new Error('Email ou senha incorreto(s) !');
        }

        // eslint-disable-next-line prettier/prettier, @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
        const { password:_, ...returnUser } = user

        // NÃO retornar a Senha, mesmo que Criptografada !!!
        return returnUser as IReturnUser;
    }
}