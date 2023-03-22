import { Test, TestingModule } from '@nestjs/testing';
import { UserTransferService } from './user-transfer.service';

describe('UserTransferService', () => {
    let service: UserTransferService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserTransferService],
        }).compile();

        service = module.get<UserTransferService>(UserTransferService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
