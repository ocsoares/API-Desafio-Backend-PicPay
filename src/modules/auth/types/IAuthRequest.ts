import { Request } from 'express';
import { IReturnUser } from 'src/interfaces/return-to-request/IReturnUser';

export interface IAuthRequest extends Request {
    user: IReturnUser;
}
