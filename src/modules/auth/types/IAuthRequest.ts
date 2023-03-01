import { Request } from 'express';
import { IReturnUser } from 'src/interfaces/return-to-body/IReturnUser';

export interface IAuthRequest extends Request {
    user: IReturnUser;
}
