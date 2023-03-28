import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IController, returnHandle } from '../../../../interfaces/IController';
import { IReturnUser } from '../../../../interfaces/return-to-request/IReturnUser';
import { CurrentUser } from '../../../../modules/auth/decorators/current-user.decorator';
import { MakeTransferDTO } from './dtos/MakeTransferDTO';
import { MakeTransferService } from './make-transfer.service';

@Controller()
export class MakeTransferController implements IController {
    constructor(private readonly _makeTransferService: MakeTransferService) {}

    @ApiTags('transfer')
    @ApiBearerAuth('bearer')
    @ApiUnauthorizedResponse()
    @ApiBadRequestResponse()
    @ApiResponse({ status: 402 })
    @ApiOkResponse()
    @Post('transfer')
    @HttpCode(200)
    async handle(
        @CurrentUser() user: IReturnUser,
        @Body() body: MakeTransferDTO,
    ): Promise<returnHandle> {
        const makeTransfer = await this._makeTransferService.execute({
            account_id: user.id,
            ...body,
        });

        return {
            message: makeTransfer,
        };
    }
}
