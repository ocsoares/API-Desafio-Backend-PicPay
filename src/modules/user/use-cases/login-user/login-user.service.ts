import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IReturnUser } from 'src/interfaces/return-to-body/IReturnUser';
import { IService } from 'src/interfaces/IService';
import { IUserPayload } from 'src/modules/auth/models/IUserPayload';

// Service responsável por fornecer o JWT !!!

@Injectable()
export class LoginUserService implements IService {
    constructor(private readonly _jwtService: JwtService) {}

    async execute(data: IReturnUser): Promise<string> {
        const payload: IUserPayload = {
            sub: data.id,
            name: data.full_name,
            email: data.email,
        };

        const JWT = this._jwtService.sign(payload);

        return JWT;
    }
}
