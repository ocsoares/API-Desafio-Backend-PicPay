import { Test, TestingModule } from '@nestjs/testing';
import { MakeTransferController } from './make-transfer.controller';

describe('MakeTransferController', () => {
    let controller: MakeTransferController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MakeTransferController],
        }).compile();

        controller = module.get<MakeTransferController>(MakeTransferController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
