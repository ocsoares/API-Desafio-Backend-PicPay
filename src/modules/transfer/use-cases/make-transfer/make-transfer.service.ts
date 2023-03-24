import { Injectable } from '@nestjs/common';
import { InsufficientBalanceException } from 'src/exceptions/transfer-exceptions/insufficient-balance.exception';
import { InvalidEmailTransferException } from 'src/exceptions/transfer-exceptions/invalid-email-transfer.exception';
import { TransferErrorException } from 'src/exceptions/transfer-exceptions/transfer-error.exception';
import { TransferToOwnEmailException } from 'src/exceptions/transfer-exceptions/transfer-to-own-email.exception';
import { UnauthorizedRoleTransferException } from 'src/exceptions/transfer-exceptions/unauthorized-role-transfer.exception';
import { InvalidUserByIdException } from 'src/exceptions/user-exceptions/invalid-user-by-id.exception';
import { IService } from 'src/interfaces/IService';
import { ITransfer } from 'src/interfaces/ITransfer';
import { TransferAuthorizerService } from 'src/providers/transfer-authorizer/transfer-authorizer.service';
import { TransferRepository } from 'src/repositories/abstracts/TransferRepository';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';

@Injectable()
export class MakeTransferService implements IService {
    constructor(
        private readonly _makeTransferRepository: UserRepository,
        private readonly _transferRepository: TransferRepository,
        private readonly _transferAuthorizerService: TransferAuthorizerService,
    ) {}

    async execute(data: ITransfer): Promise<void> {
        const user = await this._makeTransferRepository.findById(
            data.account_id,
        );

        if (!user) {
            throw new InvalidUserByIdException();
        }

        if (user.role === 'shopkeeper') {
            throw new UnauthorizedRoleTransferException();
        }

        const isValidEmail = await this._makeTransferRepository.findByEmail(
            data.to_user_email,
        );

        if (!isValidEmail) {
            throw new InvalidEmailTransferException();
        }

        if (data.to_user_email === user.email) {
            throw new TransferToOwnEmailException();
        }

        // Transfer

        if (user.balance === 0 || user.balance < 0) {
            throw new InsufficientBalanceException();
        }

        const balanceAfterTransfer = user.balance - data.value;

        if (balanceAfterTransfer < 0) {
            throw new InsufficientBalanceException();
        }

        try {
            const response = await this._transferAuthorizerService.execute();

            if (response !== 'Success') {
                throw new Error();
            }

            await this._transferRepository.transfer(data);
        } catch {
            throw new TransferErrorException();
        }
    }
}
