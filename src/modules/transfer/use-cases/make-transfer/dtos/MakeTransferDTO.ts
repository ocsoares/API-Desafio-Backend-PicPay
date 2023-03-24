import { IsEmail, IsNotEmpty, IsPositive } from 'class-validator';
import { IsTwoDecimalPlacesOrNoDecimal } from 'src/validators/is-two-decimal-places-or-no-decimal.decorator';

export class MakeTransferDTO {
    @IsNotEmpty()
    @IsEmail()
    readonly to_user_email: string;

    @IsNotEmpty()
    @IsPositive()
    @IsTwoDecimalPlacesOrNoDecimal()
    readonly value: number;
}
