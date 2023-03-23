import { Global, Module } from '@nestjs/common';
import { TransferRepository } from 'src/repositories/abstracts/TransferRepository';
import { UserRepository } from '../../../repositories/abstracts/UserRepository';
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
    ],
    exports: [UserRepository, TransferRepository],
})
export class PrismaDatabaseModule {}
