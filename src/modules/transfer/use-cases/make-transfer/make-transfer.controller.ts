import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IController, returnHandle } from 'src/interfaces/IController';
import { IReturnUser } from 'src/interfaces/return-to-request/IReturnUser';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { MakeTransferDTO } from './dtos/MakeTransferDTO';
import { MakeTransferService } from './make-transfer.service';

@Controller()
export class MakeTransferController implements IController {
    constructor(private readonly _userTransferService: MakeTransferService) {}

    @Post('transfer')
    @HttpCode(200)
    async handle(
        @CurrentUser() user: IReturnUser,
        @Body() body: MakeTransferDTO,
    ): Promise<returnHandle> {
        await this._userTransferService.execute({
            account_id: user.id,
            ...body,
        });

        return {
            message: 'Transferência realizada com sucesso !',
        };
    }
}
