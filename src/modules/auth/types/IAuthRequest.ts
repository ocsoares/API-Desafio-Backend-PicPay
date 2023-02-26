import { Request } from 'express';
import { IReturnUser } from 'src/interfaces/IReturnUser';

export interface IAuthRequest extends Request {
    user: IReturnUser;
}
