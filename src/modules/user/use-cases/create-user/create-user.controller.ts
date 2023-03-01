import { Body, Controller, Post } from '@nestjs/common';
import { IController, returnHandle } from 'src/interfaces/IController';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { CreateUserService } from './create-user.service';
import { CreateUserDTO } from './dtos/CreateUserDTO';

@Controller('auth')
export class CreateUserController implements IController {
    constructor(private readonly _createUserService: CreateUserService) {}

    @IsPublic()
    @Post('register')
    async handle(@Body() body: CreateUserDTO): Promise<returnHandle> {
        const createUser = await this._createUserService.execute(body);

        return {
            message: 'User successfully registered !',
            data: createUser,
        };
    }
}
