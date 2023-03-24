import { Test, TestingModule } from '@nestjs/testing';
import { SendNotifyController } from './send-notify.controller';

describe('SendNotifyController', () => {
  let controller: SendNotifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendNotifyController],
    }).compile();

    controller = module.get<SendNotifyController>(SendNotifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
