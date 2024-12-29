import { Test, TestingModule } from '@nestjs/testing';
import { BirthdayMessageService } from './birthday-message.service';

describe('BirthdayMessageService', () => {
  let service: BirthdayMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BirthdayMessageService],
    }).compile();

    service = module.get<BirthdayMessageService>(BirthdayMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
