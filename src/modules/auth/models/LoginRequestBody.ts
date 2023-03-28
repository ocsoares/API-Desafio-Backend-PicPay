import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestBody {
    @ApiProperty({ type: 'email', example: 'victoroliveira12@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'victor123' })
    @IsNotEmpty()
    @IsString()
    password: string;
}
