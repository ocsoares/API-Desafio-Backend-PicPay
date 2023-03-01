import {
    BadRequestException,
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoginRequestBody } from '../models/LoginRequestBody';
import { validate } from 'class-validator';

@Injectable()
export class LoginValidationBodyMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const { body } = req;

        const loginRequestBody = new LoginRequestBody();

        loginRequestBody.email = body.email;
        loginRequestBody.password = body.password;

        const validations = await validate(loginRequestBody);

        if (validations.length) {
            throw new BadRequestException(
                validations.reduce((acc, curr) => {
                    return [...acc, ...Object.values(curr.constraints)];
                }, []),
            );
        }

        if (body.email && body.password) {
            if (Object.keys(body).length >= 3) {
                throw new BadRequestException([
                    'just the properties email and password should exist',
                ]);
            }
        }

        next();
    }
}
