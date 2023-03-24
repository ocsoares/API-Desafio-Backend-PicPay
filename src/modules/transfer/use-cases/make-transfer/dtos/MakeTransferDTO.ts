import { IsEmail, IsNotEmpty, IsPositive } from 'class-validator';

export class MakeTransferDTO {
    @IsNotEmpty()
    @IsEmail()
    readonly to_user_email: string;

    @IsNotEmpty()
    @IsPositive()
    readonly value: number;
}
