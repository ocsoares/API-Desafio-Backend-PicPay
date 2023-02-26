import { IReturnTransaction } from 'src/interfaces/IReturnTransaction';
import { ITransaction } from 'src/models/ITransaction';

export abstract class TransactionRepository {
    abstract create(data: ITransaction | object): Promise<IReturnTransaction>;
    abstract findOneById(transfer_id: string): Promise<IReturnTransaction>;
    abstract findAllById(account_id: string): Promise<IReturnTransaction[]>;
}
