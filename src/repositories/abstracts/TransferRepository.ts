import { ITransfer } from 'src/models/ITransfer';

export abstract class TransferRepository {
    abstract transfer(data: ITransfer): Promise<void>;
}
