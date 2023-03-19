import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

describe('MailService', () => {
  let mailService: MailService;
  const mockMailerService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    })
      .overrideProvider(MailService)
      .useValue(mockMailerService)
      .compile();

    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });
});
