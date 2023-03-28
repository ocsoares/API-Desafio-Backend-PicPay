import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';

export class CreateUserDTO {
    @ApiProperty({
        description: `A role deve ser uma role válida entre "user" e "shopkeeper", em que 
        "user" pode fazer e receber transferências, e "shopkeeper" pode apenas receber transferências `,
        enum: ['user', 'shopkeeper'],
        default: 'user',
    })
    @IsNotEmpty()
    @IsIn(['user', 'shopkeeper'])
    readonly role: 'user' | 'shopkeeper';

    @ApiProperty({ example: 'Victor Oliveira' })
    @IsNotEmpty()
    @IsString()
    readonly full_name: string;

    @ApiProperty({
        description:
            'O cpf deve ser um cpf válido no formato XXX.XXX.XXX-XX ou XXXXXXXXXXX ',
        examples: ['565.934.880-70', '44493508043'],
        default: '256.291.450-37',
    })
    @IsNotEmpty()
    @IsCPF()
    readonly cpf: string;

    @ApiProperty({ type: 'email', example: 'victoroliveira12@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ example: 'victor123' })
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
