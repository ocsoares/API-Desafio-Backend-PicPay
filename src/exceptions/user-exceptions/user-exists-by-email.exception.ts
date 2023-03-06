import { HttpException } from '@nestjs/common';

export const emailExceptionMessage =
    'A user is already registered with this email !';

export class UserExistsByEmailException extends HttpException {
    constructor() {
        super(emailExceptionMessage, 400);
    }
}
