import { HttpException } from '@nestjs/common';

export const invalidUserByIdExceptionMessage =
    'Não foi possível encontrar o usuário pelo ID fornecido !';

export class InvalidUserByIdException extends HttpException {
    constructor() {
        super(invalidUserByIdExceptionMessage, 400);
    }
}
