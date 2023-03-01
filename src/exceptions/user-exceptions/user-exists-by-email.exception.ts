import { HttpException } from '@nestjs/common';

export class UserExistsByEmailException extends HttpException {
    constructor() {
        super('A user is already registered with this email !', 400);
    }
}
