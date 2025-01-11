import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TestimonialDto } from './dto/testimonial.dto';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TestimonialService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async createTestimonial(testimonialDto: TestimonialDto) {
    const isWorkspaceWithSameNameExists =
      await this.prismaService.testimonial.findFirst({
        where: {
          email: testimonialDto.email,
          workspaceId: testimonialDto.workspaceId,
        },
      });
    if (isWorkspaceWithSameNameExists) {
      throw new ConflictException(
        'You have already submitted a testimonial with this email for this user.',
      );
    }
    const newTestimonial = await this.prismaService.testimonial.create({
      data: testimonialDto,
    });
    if (newTestimonial)
      return {
        newTestimonial,
        message: `We sincerely appreciate your thoughtful review, ${newTestimonial.name}.`,
      };
    return null;
  }

  async shareTestimonial(workspaceId: string, email: string) {
    if (!workspaceId) {
      throw new NotFoundException('Workspace Id is required');
    }

    const link = `${this.configService.get('FRONTEND_URL')}/create-review?workspaceId=${workspaceId}`;
    await this.emailService.sendTemplatedEmail(
      email,
      "We'd Love Your Feedback!",
      'review-request',
      { userName: 'janith', reviewLink: link },
    );
  }

  async getTestimonialsByWorkspaceId(
    workspaceId: string,
    filters?: { dateRange?: { from: Date; to: Date }; searchQuery?: string },
  ) {
    if (!workspaceId) {
      throw new NotFoundException('Workspace Id is required');
    }
    const whereClause: any = { workspaceId: workspaceId };

    if (filters?.dateRange) {
      whereClause.createdAt = {
        gte: filters.dateRange.from,
        lte: filters.dateRange.to,
      };
    }

    if (filters?.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      whereClause.OR = [
        { name: { contains: searchLower } },
        { email: { contains: searchLower } },
      ];
    }

    const testimonials = await this.prismaService.testimonial.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    return testimonials;
  }

  async getTestimonials() {
    return await this.prismaService.testimonial.findMany();
  }

  async getTestimonialById(id: string) {
    if (!id) {
      throw new BadRequestException(
        'Testimonial Id is required for this process',
      );
    }
    const isTestimonialExists = await this.prismaService.testimonial.findUnique(
      {
        where: {
          id,
        },
      },
    );
    if (!isTestimonialExists) {
      throw new NotFoundException(
        "Couldn't find any testimonials for the given id",
      );
    }
    return isTestimonialExists;
  }

  async updateTestimonial(id: string, testimonialDto: TestimonialDto) {
    const isTestimonialExists = await this.prismaService.testimonial.findUnique(
      {
        where: {
          id,
        },
      },
    );
    if (!isTestimonialExists) {
      throw new NotFoundException("Couldn't find any testimonial for given id");
    }
    const updatedTestimonial = await this.prismaService.testimonial.update({
      where: {
        id,
      },
      data: testimonialDto,
    });
    return {
      updatedTestimonial,
      message: 'You have successfully updated your review',
    };
  }

  async deleteTestimonial(id: string) {
    const isTestimonialExists = await this.prismaService.testimonial.findUnique(
      {
        where: {
          id,
        },
      },
    );
    if (!isTestimonialExists) {
      throw new NotFoundException("Couldn't find testimonial for given id");
    }
    const deletedTestimonial = await this.prismaService.testimonial.delete({
      where: {
        id,
      },
    });
    return {
      deletedTestimonial,
      message: 'The testimonial has been successfully deleted.',
    };
  }
}
