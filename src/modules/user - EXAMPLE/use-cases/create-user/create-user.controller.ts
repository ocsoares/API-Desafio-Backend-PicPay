import { Body, Controller, Post } from '@nestjs/common';
import { IController, returnHandle } from 'src/interfaces/IController';
import { IsPublic } from '../../../../modules/auth/decorators/is-public.decorator';
import { CreateUserService } from './create-user.service';
import { CreateUserDTO } from './dtos/CreateUserDTO';

// Essa Classe recebe em seu constructor o Service que contém os Métodos e verificações para
// criar um Usuário !!

@Controller('auth')
export class CreateUserController implements IController {
    constructor(private readonly _createUserService: CreateUserService) {}

    @IsPublic()
    @Post('register')
    async handle(@Body() body: CreateUserDTO): Promise<returnHandle> {
        const createUser = await this._createUserService.execute(body);

        // Retorna AUTOMATICAMENTE em Json !!
        return {
            message: 'Usuário criado com sucesso !',
            data: createUser,
        };
    }
}
