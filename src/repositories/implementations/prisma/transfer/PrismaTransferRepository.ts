import { Injectable } from '@nestjs/common';
import { ITransfer } from 'src/models/ITransfer';
import { TransferRepository } from 'src/repositories/abstracts/TransferRepository';
import { PrismaService } from '../prisma-client.service';

@Injectable()
export class PrismaTransferRepository implements TransferRepository {
    constructor(private readonly _prismaService: PrismaService) {}

    async transfer(data: ITransfer): Promise<void> {
        // Retira o valor a ser transferido do balanço do pagador
        await this._prismaService.user.update({
            where: { id: data.account_id },
            data: { balance: { decrement: parseFloat(data.value.toFixed(2)) } },
        });

        // Adiciona o valor recebido ao balanço do destinatário
        await this._prismaService.user.update({
            where: { email: data.to_user_email },
            data: { balance: { increment: parseFloat(data.value.toFixed(2)) } },
        });
    }
}
