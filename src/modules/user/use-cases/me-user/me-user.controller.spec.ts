import { Test, TestingModule } from '@nestjs/testing';
import { MeUserController } from './me-user.controller';

describe('MeUserController', () => {
    let controller: MeUserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MeUserController],
        }).compile();

        controller = module.get<MeUserController>(MeUserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
