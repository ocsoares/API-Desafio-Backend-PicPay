import { Module } from '@nestjs/common';
import { UserTransferService } from './use-cases/user-transfer/user-transfer.service';
import { ShopkeeperTransferService } from './use-cases/shopkeeper-transfer/shopkeeper-transfer.service';
import { MakeTransferService } from './use-cases/make-transfer/make-transfer.service';
import { MakeTransferController } from './use-cases/make-transfer/make-transfer.controller';

@Module({
    providers: [
        UserTransferService,
        ShopkeeperTransferService,
        MakeTransferService,
    ],
    controllers: [MakeTransferController],
})
export class TransferModule {}
