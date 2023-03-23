import { HttpException } from '@nestjs/common';

export const unauthorizedRoleTransferExceptionMessage =
    'Lojistas não são permitidos a fazerem transferência !';

export class UnauthorizedRoleTransferException extends HttpException {
    constructor() {
        super(unauthorizedRoleTransferExceptionMessage, 401);
    }
}
