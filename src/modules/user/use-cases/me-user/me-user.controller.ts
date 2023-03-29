import { Controller, Get, HttpCode } from '@nestjs/common';
import { IController, returnHandle } from '../../../../interfaces/IController';
import { IReturnUser } from '../../../../interfaces/return-to-request/IReturnUser';
import { CurrentUser } from '../../../../modules/auth/decorators/current-user.decorator';
import { MeUserService } from './me-user.service';

@Controller('auth')
export class MeUserController implements IController {
    constructor(private readonly _meUserService: MeUserService) {}

    @Get('me')
    @HttpCode(200)
    async handle(@CurrentUser() user: IReturnUser): Promise<returnHandle> {
        const meUser = await this._meUserService.execute(user.id);

        return {
            message: `${meUser.full_name} autenticado !`,
            data: meUser,
        };
    }
}
