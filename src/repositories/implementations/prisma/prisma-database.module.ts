import { Global, Module } from '@nestjs/common';
import { NotifyRepository } from 'src/repositories/abstracts/NotifyRepository';
import { TransferRepository } from 'src/repositories/abstracts/TransferRepository';
import { UserRepository } from '../../../repositories/abstracts/UserRepository';
import { PrismaNotifyRepository } from './notify/PrismaNotifyRepository';
import { PrismaService } from './prisma-client.service';
import { PrismaTransferRepository } from './transfer/PrismaTransferRepository';
import { PrismaUserRepository } from './user/PrismaUserRepository';

@Global()
@Module({
    providers: [
        PrismaService,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
        {
            provide: TransferRepository,
            useClass: PrismaTransferRepository,
        },
        {
            provide: NotifyRepository,
            useClass: PrismaNotifyRepository,
        },
    ],
    exports: [UserRepository, TransferRepository, NotifyRepository],
})
export class PrismaDatabaseModule {}
