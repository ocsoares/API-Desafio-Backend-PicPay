import { Test, TestingModule } from '@nestjs/testing';
import { TransferAuthorizerService } from './transfer-authorizer.service';

describe('TransferAuthorizerService', () => {
  let service: TransferAuthorizerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferAuthorizerService],
    }).compile();

    service = module.get<TransferAuthorizerService>(TransferAuthorizerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
