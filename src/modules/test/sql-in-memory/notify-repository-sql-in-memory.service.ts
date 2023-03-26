import { Injectable } from '@nestjs/common';
import { INotify } from '../../../models/INotify';
import { NotifyRepository } from '../../../repositories/abstracts/NotifyRepository';

@Injectable()
export class NotifyRepositorySQLInMemory implements NotifyRepository {
    private notifications: INotify[] = [];

    async send(data: INotify): Promise<void> {
        this.notifications.push(data);
    }
}
