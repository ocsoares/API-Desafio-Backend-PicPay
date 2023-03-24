import { Module } from '@nestjs/common';
import { TransferAuthorizerService } from 'src/providers/transfer-authorizer/transfer-authorizer.service';
import { MakeTransferController } from './use-cases/make-transfer/make-transfer.controller';
import { MakeTransferService } from './use-cases/make-transfer/make-transfer.service';
import { SendNotifyController } from './use-cases/send-notify/send-notify.controller';
import { SendNotifyService } from './use-cases/send-notify/send-notify.service';

@Module({
    providers: [
        MakeTransferService,
        {
            provide: TransferAuthorizerService,
            useClass: TransferAuthorizerService,
        },
        SendNotifyService,
    ],
    controllers: [MakeTransferController, SendNotifyController],
})
export class TransferModule {}
