import { Test, TestingModule } from '@nestjs/testing';
import { MeUserService } from './me-user.service';

describe('MeUserService', () => {
    let service: MeUserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MeUserService],
        }).compile();

        service = module.get<MeUserService>(MeUserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
