import { Module } from '@nestjs/common';
import { TransferAuthorizerService } from '../../providers/transfer-authorizer/transfer-authorizer.service';
import { MakeTransferController } from './use-cases/make-transfer/make-transfer.controller';
import { MakeTransferService } from './use-cases/make-transfer/make-transfer.service';
import { SendNotifyService } from '../../providers/send-notify/send-notify.service';

@Module({
    providers: [
        MakeTransferService,
        {
            provide: TransferAuthorizerService,
            useClass: TransferAuthorizerService,
        },
        SendNotifyService,
    ],
    controllers: [MakeTransferController],
})
export class TransferModule {}
