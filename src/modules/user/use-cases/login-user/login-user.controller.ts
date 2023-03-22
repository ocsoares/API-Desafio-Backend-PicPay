import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { IController, returnHandle } from 'src/interfaces/IController';
import { LocalAuthGuard } from '../../../auth/guards/local-auth.guard';
import { IAuthRequest } from 'src/modules/auth/types/IAuthRequest';
import { LoginUserService } from './login-user.service';
import { IsPublic } from '../../../auth/decorators/is-public.decorator';

@Controller('auth')
export class LoginUserController implements IController {
    constructor(private readonly _loginUserService: LoginUserService) {}

    @IsPublic()
    @Post('login')
    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    async handle(@Request() req: IAuthRequest): Promise<returnHandle> {
        const JWT = await this._loginUserService.execute(req.user);

        return {
            message: 'Login realizado com sucesso !',
            data: JWT,
        };
    }
}
