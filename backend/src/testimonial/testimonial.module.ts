import { Module } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [TestimonialService, PrismaService],
  controllers: [TestimonialController],
})
export class TestimonialModule {}
