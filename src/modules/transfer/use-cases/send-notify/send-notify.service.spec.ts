import { Test, TestingModule } from '@nestjs/testing';
import { SendNotifyService } from './send-notify.service';

describe('SendNotifyService', () => {
  let service: SendNotifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendNotifyService],
    }).compile();

    service = module.get<SendNotifyService>(SendNotifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
