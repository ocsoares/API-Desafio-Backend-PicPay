import { HttpException } from '@nestjs/common';

export class UserExistsByCpfException extends HttpException {
    constructor() {
        super('A user is already registered with this CPF !', 400);
    }
}
