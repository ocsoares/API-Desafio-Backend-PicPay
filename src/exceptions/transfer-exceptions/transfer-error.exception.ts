import { HttpException } from '@nestjs/common';

export const transferErrorExceptionMessage =
    'Não foi possível realizar a transferência, tente novamente mais tarde.';

export class TransferErrorException extends HttpException {
    constructor() {
        super(transferErrorExceptionMessage, 500);
    }
}
