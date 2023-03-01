import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private _authService: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string) {
        return await this._authService.validateUser(email, password);
    }
}
