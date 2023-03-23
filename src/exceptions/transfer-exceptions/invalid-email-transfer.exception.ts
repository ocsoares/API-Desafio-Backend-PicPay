import { HttpException } from '@nestjs/common';

export const invalidEmailTransferExceptionMessage =
    'Email para transferência inválido !';

export class InvalidEmailTransferException extends HttpException {
    constructor() {
        super(invalidEmailTransferExceptionMessage, 400);
    }
}
