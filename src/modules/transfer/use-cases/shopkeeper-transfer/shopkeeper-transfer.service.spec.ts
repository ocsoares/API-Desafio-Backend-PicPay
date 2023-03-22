import { Test, TestingModule } from '@nestjs/testing';
import { ShopkeeperTransferService } from './shopkeeper-transfer.service';

describe('ShopkeeperTransferService', () => {
    let service: ShopkeeperTransferService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ShopkeeperTransferService],
        }).compile();

        service = module.get<ShopkeeperTransferService>(
            ShopkeeperTransferService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
