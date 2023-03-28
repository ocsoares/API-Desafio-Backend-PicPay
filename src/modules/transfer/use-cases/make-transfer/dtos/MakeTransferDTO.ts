import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPositive } from 'class-validator';
import { IsTwoDecimalPlacesOrNoDecimal } from '../../../../../validators/is-two-decimal-places-or-no-decimal.decorator';

export class MakeTransferDTO {
    @ApiProperty({ type: 'email', example: 'lucasroberto@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    readonly to_user_email: string;

    @ApiProperty({
        description:
            'O value deve ser um número inteiro, ou um número limitado à duas casas decimais',
        examples: [8, 13, 210, 210.1, 315.12, 10.09],
        default: 120,
    })
    @IsNotEmpty()
    @IsPositive()
    @IsTwoDecimalPlacesOrNoDecimal()
    readonly value: number;
}
