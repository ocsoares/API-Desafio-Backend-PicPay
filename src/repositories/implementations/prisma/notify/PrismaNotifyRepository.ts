import { Injectable } from '@nestjs/common';
import { INotify } from '../../../../models/INotify';
import { NotifyRepository } from '../../../../repositories/abstracts/NotifyRepository';
import { PrismaService } from '../prisma-client.service';

@Injectable()
export class PrismaNotifyRepository implements NotifyRepository {
    constructor(private readonly _prismaService: PrismaService) {}

    async send(data: INotify): Promise<void> {
        await this._prismaService.notify.create({
            data,
        });
    }
}
