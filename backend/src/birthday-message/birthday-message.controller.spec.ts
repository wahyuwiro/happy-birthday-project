import { Test, TestingModule } from '@nestjs/testing';
import { BirthdayMessageController } from './birthday-message.controller';

describe('BirthdayMessageController', () => {
  let controller: BirthdayMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BirthdayMessageController],
    }).compile();

    controller = module.get<BirthdayMessageController>(BirthdayMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
