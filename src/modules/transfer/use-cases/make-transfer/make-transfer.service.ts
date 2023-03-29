import { Injectable } from '@nestjs/common';
import { InsufficientBalanceException } from '../../../../exceptions/transfer-exceptions/insufficient-balance.exception';
import { InvalidEmailTransferException } from '../../../../exceptions/transfer-exceptions/invalid-email-transfer.exception';
import { TransferErrorException } from '../../../../exceptions/transfer-exceptions/transfer-error.exception';
import { TransferToOwnEmailException } from '../../../../exceptions/transfer-exceptions/transfer-to-own-email.exception';
import { UnauthorizedRoleTransferException } from '../../../../exceptions/transfer-exceptions/unauthorized-role-transfer.exception';
import { InvalidUserByIdException } from '../../../../exceptions/user-exceptions/invalid-user-by-id.exception';
import { IService } from '../../../../interfaces/IService';
import { ITransfer } from '../../../../models/ITransfer';
import { TransferAuthorizerService } from '../../../../providers/transfer-authorizer/transfer-authorizer.service';
import { NotifyRepository } from '../../../../repositories/abstracts/NotifyRepository';
import { TransferRepository } from '../../../../repositories/abstracts/TransferRepository';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import {
    exceededMonthlyRequestQuotaErrorMessage,
    SendNotifyService,
} from '../../../../providers/send-notify/send-notify.service';

@Injectable()
export class MakeTransferService implements IService {
    constructor(
        private readonly _makeTransferRepository: TransferRepository,
        private readonly _userRepository: UserRepository,
        private readonly _notifyRepository: NotifyRepository,
        private readonly _transferAuthorizerService: TransferAuthorizerService,
        private readonly _sendNotifyService: SendNotifyService,
    ) {}

    async execute(data: ITransfer): Promise<string> {
        const user = await this._userRepository.findById(data.account_id);

        if (!user) {
            throw new InvalidUserByIdException();
        }

        if (user.role === 'shopkeeper') {
            throw new UnauthorizedRoleTransferException();
        }

        const isValidPayee = await this._userRepository.findByEmail(
            data.to_user_email,
        );

        if (!isValidPayee) {
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
            const isAuthorized =
                await this._transferAuthorizerService.execute();

            if (isAuthorized !== 'Autorizado') {
                throw new Error();
            }

            await this._makeTransferRepository.transfer(data);

            await this._notifyRepository.send({
                payer_name: user.full_name,
                payer_cpf: user.cpf,
                transfer_amount: data.value,
                transfer_time: new Date(),
                to_user_id: isValidPayee.id,
            });

            const notificationSent = await this._sendNotifyService.execute();

            if (
                notificationSent !== 'Success' &&
                notificationSent !== exceededMonthlyRequestQuotaErrorMessage
            ) {
                throw new Error();
            }
        } catch (error) {
            throw new TransferErrorException();
        }

        return `Transferência realizada com sucesso no valor de R$${data.value} para o usuário de email ${data.to_user_email} !`;
    }
}
