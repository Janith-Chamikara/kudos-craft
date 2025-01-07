import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TestimonialDto } from './dto/testimonial.dto';

@Injectable()
export class TestimonialService {
  constructor(private readonly prismaService: PrismaService) {}

  async createWorkspace(testimonialDto: TestimonialDto) {
    console.log(testimonialDto);
    const isWorkspaceWithSameNameExists =
      await this.prismaService.testimonial.findFirst({
        where: {
          email: testimonialDto.email,
          workspaceId: testimonialDto.workspaceId,
        },
      });
    if (isWorkspaceWithSameNameExists) {
      throw new BadRequestException(
        'You have already submitted a testimonial with this email for this user.',
      );
    }
    const newTestimonial = await this.prismaService.testimonial.create({
      data: testimonialDto,
    });
    if (newTestimonial) return newTestimonial;
    return null;
  }

  async getTestimonialsByWorkspaceId(workspaceId: string) {
    const testimonials = await this.prismaService.testimonial.findMany({
      where: {
        workspaceId,
      },
    });
    console.log(testimonials);
    return testimonials;
  }

  async getTestimonials() {
    return this.prismaService.testimonial.findMany();
  }

  async getTestimonialById(id: string) {
    return this.prismaService.testimonial.findUnique({
      where: {
        id,
      },
    });
  }

  async updateTestimonial(id: string, testimonialDto: TestimonialDto) {
    return this.prismaService.testimonial.update({
      where: {
        id,
      },
      data: testimonialDto,
    });
  }

  async deleteTestimonial(id: string) {
    return this.prismaService.testimonial.delete({
      where: {
        id,
      },
    });
  }
}
