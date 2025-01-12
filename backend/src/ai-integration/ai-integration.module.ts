import { Module } from '@nestjs/common';
import { AiIntegrationController } from './ai-integration.controller';
import { AiIntegrationService } from './ai-integration.service';

@Module({
  controllers: [AiIntegrationController],
  providers: [AiIntegrationService],
})
export class AiIntegrationModule {}
