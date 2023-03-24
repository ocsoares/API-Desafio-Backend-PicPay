import { INotify } from 'src/models/INotify';

export abstract class NotifyRepository {
    abstract send(data: INotify): Promise<INotify>;
}
