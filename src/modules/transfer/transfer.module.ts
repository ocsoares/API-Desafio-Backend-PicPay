import { Module } from '@nestjs/common';
import { TransferAuthorizerService } from 'src/providers/transfer-authorizer/transfer-authorizer.service';
import { MakeTransferController } from './use-cases/make-transfer/make-transfer.controller';
import { MakeTransferService } from './use-cases/make-transfer/make-transfer.service';

@Module({
    providers: [
        MakeTransferService,
        {
            provide: TransferAuthorizerService,
            useClass: TransferAuthorizerService,
        },
    ],
    controllers: [MakeTransferController],
})
export class TransferModule {}
