import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class MakeTransferDTO {
    @IsNotEmpty()
    @IsEmail()
    readonly to_user_email: string;

    @IsNotEmpty()
    @IsNumber(undefined, { message: 'value must be a number' })
    readonly value: number;
}
