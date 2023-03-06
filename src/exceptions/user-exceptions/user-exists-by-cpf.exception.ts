import { HttpException } from '@nestjs/common';

export const cpfExceptionMessage =
    'A user is already registered with this CPF !';

export class UserExistsByCpfException extends HttpException {
    constructor() {
        super(cpfExceptionMessage, 400);
    }
}
