import { Controller, Post } from '@nestjs/common';
import { UnauthorizedRoleTransferException } from 'src/exceptions/transfer-exceptions/unauthorized-role-transfer.exception';
import { IController, returnHandle } from 'src/interfaces/IController';
import { IReturnUser } from 'src/interfaces/return-to-request/IReturnUser';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { MakeTransferService } from './make-transfer.service';

@Controller()
export class MakeTransferController implements IController {
    constructor(private readonly _userTransferService: MakeTransferService) {}

    @Post('transfer')
    async handle(@CurrentUser() user: IReturnUser): Promise<returnHandle> {
        return {
            data: null,
            message: 'any',
        };
    }
}
