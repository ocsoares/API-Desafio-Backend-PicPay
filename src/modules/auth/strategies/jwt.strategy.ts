import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserJWT } from '../models/IUserJWT';
import { IUserPayload } from '../models/IUserPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: IUserPayload): Promise<IUserJWT> {
        return {
            id: payload.sub,
            role: payload.role,
            full_name: payload.full_name,
            email: payload.email,
        };
    }
}
