import { Module } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { AiIntegrationService } from 'src/ai-integration/ai-integration.service';

@Module({
  providers: [
    TestimonialService,
    PrismaService,
    EmailService,
    AiIntegrationService,
  ],
  controllers: [TestimonialController],
})
export class TestimonialModule {}
