import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IReturnUser } from 'src/interfaces/return-to-body/IReturnUser';
import { IAuthRequest } from '../types/IAuthRequest';

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext): IReturnUser => {
        const request = context.switchToHttp().getRequest<IAuthRequest>();

        return request.user;
    },
);
