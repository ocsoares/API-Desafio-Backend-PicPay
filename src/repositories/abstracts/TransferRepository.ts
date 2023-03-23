import { ITransfer } from 'src/interfaces/ITransfer';

export abstract class TransferRepository {
    abstract transfer(data: ITransfer): Promise<void>;
}
