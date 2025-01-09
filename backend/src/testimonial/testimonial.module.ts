import { Module } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';

@Module({
  providers: [TestimonialService, PrismaService, EmailService],
  controllers: [TestimonialController],
})
export class TestimonialModule {}
