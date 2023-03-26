import { Injectable } from '@nestjs/common';
import { ITransfer } from 'src/models/ITransfer';
import { TransferRepository } from 'src/repositories/abstracts/TransferRepository';

// Fiz essa interface apenas para o teste, porque o IUser original tem o balance
// com readonly, e não poderia ser modificado no transfer abaixo !
interface IUserTest {
    readonly id?: string;
    readonly role: 'user' | 'shopkeeper';
    readonly full_name: string;
    readonly cpf: string;
    readonly email: string;
    readonly password: string;
    balance?: number;
}

@Injectable()
export class TransferRepositorySQLInMemory implements TransferRepository {
    private users: IUserTest[] = [];

    async transfer(data: ITransfer): Promise<void> {
        // Encontra o remetente e decrementa o saldo
        this.users.find((user) => user.id === data.account_id).balance -=
            data.value;

        // Encontra o destinatário e incrementa o saldo
        this.users.find((user) => user.email === data.to_user_email).balance +=
            data.value;
    }
}
