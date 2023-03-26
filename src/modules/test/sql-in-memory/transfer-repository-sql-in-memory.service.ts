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
    async transfer(data: ITransfer): Promise<void> {
        const payerUsers: IUserTest[] = [
            {
                id: data.account_id,
                role: 'user',
                full_name: 'Payer User',
                cpf: '66099594043',
                email: 'payeruser@gmail.com',
                password: 'payeruser123',
                balance: 230,
            },
        ];

        const receiverUsers: IUserTest[] = [
            {
                id: 'receiveruser_id',
                role: 'shopkeeper',
                full_name: 'Receiver User',
                cpf: '27345982050',
                email: data.to_user_email,
                password: 'receiveruser123',
                balance: 100,
            },
        ];

        // Encontra o pagador e decrementa o balanço
        payerUsers.find((user) => user.id === data.account_id).balance -=
            data.value;

        // Encontra o destinatário e adiciona o valor recebido ao balanço
        receiverUsers.find(
            (user) => user.email === data.to_user_email,
        ).balance += data.value;
    }
}
