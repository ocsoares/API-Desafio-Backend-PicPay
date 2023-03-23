import { HttpException } from '@nestjs/common';

export const transferToOwnEmailExceptionMessage =
    'Não é permitido fazer uma transferência para você mesmo !';

export class TransferToOwnEmailException extends HttpException {
    constructor() {
        super(transferToOwnEmailExceptionMessage, 400);
    }
}
