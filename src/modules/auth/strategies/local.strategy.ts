import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

// Esse LocalStrategy pega as Informações do Body da Rota (vou usar no Login) e repassa
// pro Método validate, que é o responsável ter a lógica de Validar um Usuário ou não !!!

// Colocar no providers em AuthModule, porque ele é @Injectable() !!
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private _authService: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string) {
        return await this._authService.validateUser(email, password);
    }
}
