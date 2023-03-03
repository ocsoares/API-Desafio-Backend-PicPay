import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';

export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    readonly full_name: string;

    @IsNotEmpty()
    @IsCPF()
    readonly cpf: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
