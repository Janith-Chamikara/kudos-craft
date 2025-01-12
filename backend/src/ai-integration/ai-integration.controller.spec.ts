import { Test, TestingModule } from '@nestjs/testing';
import { AiIntegrationController } from './ai-integration.controller';

describe('AiIntegrationController', () => {
  let controller: AiIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiIntegrationController],
    }).compile();

    controller = module.get<AiIntegrationController>(AiIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
