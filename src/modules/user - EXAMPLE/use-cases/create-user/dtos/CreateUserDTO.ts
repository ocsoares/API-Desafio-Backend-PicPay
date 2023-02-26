import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

// Para usar esses Decorators de VALIDAR Dados, PRECISA ser CLASSE, Interface NÃO DÁ CERTO !!
// OBS: Esses Decorators podem ter várias customizações, como por exemplo, mudar a Mensagem de Erro !!

export class CreateUserDTO {
    @IsNotEmpty({ message: 'O campo name não pode ser vazio !' })
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail(undefined, { message: 'Insira um email válido !' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(7, 120)
    password: string;
}
