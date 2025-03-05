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
import { AiIntegrationService } from 'src/ai-integration/ai-integration.service';

@Injectable()
export class TestimonialService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly aiIntegrationService: AiIntegrationService,
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

  async getTestimonialsByUserId(userId: string) {
    if (!userId) {
      throw new BadRequestException('User Id is required for this process');
    }
    const testimonials = await this.prismaService.testimonial.findMany({
      where: {
        workspace: {
          ownerId: userId,
        },
      },
    });
    return testimonials;
  }
  async getTestimonials() {
    const testimonials = await this.prismaService.testimonial.findMany();
    return testimonials;
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

  async updateTestimonial(id: string, testimonialDto: Partial<TestimonialDto>) {
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

  async analyzeTestimonials(userId: string) {
    if (!userId) {
      throw new BadRequestException('User Id is required for this process');
    }

    const testimonials = await this.prismaService.testimonial.findMany({
      where: {
        workspace: {
          ownerId: userId,
        },
      },
    });

    const analyzedTestimonials = await Promise.all(
      testimonials.map(async (testimonial) => {
        if (!testimonial.isAnalyzed) {
          const sentiment = await this.aiIntegrationService.classifyTestimonial(
            testimonial.review,
            testimonial.ratings,
          );

          const updatedTestimonial =
            await this.prismaService.testimonial.update({
              where: { id: testimonial.id },
              data: {
                isAnalyzed: true,
                sentiment: sentiment,
              },
            });

          return {
            ...updatedTestimonial,
            sentiment: sentiment,
          };
        }

        return {
          ...testimonial,
          sentiment: testimonial.sentiment,
        };
      }),
    );
    console.log(analyzedTestimonials);
    return analyzedTestimonials;
  }
  async getSentimentOverTime() {
    // Fetch all testimonials with the `createdAt` and `sentiment` fields
    const testimonials = await this.prismaService.testimonial.findMany({
      select: {
        createdAt: true,
        sentiment: true,
      },
    });

    // Process the data to calculate sentiment scores grouped by date
    const groupedResults = testimonials.reduce(
      (acc, testimonial) => {
        const date = testimonial.createdAt.toISOString().split('T')[0]; // Extract YYYY-MM-DD
        const sentimentScore =
          testimonial.sentiment === 'positive'
            ? 1
            : testimonial.sentiment === 'neutral'
              ? 0.5
              : 0;

        if (!acc[date]) {
          acc[date] = { totalScore: 0, count: 0 };
        }

        acc[date].totalScore += sentimentScore; // Add the sentiment score
        acc[date].count++; // Increment the count for the date

        return acc;
      },
      {} as Record<string, { totalScore: number; count: number }>,
    );

    // Convert the grouped results into an array with average sentiment per date
    return Object.entries(groupedResults).map(
      ([date, { totalScore, count }]) => ({
        date,
        sentiment: totalScore / count, // Calculate the average sentiment
      }),
    );
  }

  async getTestimonialsOverTime() {
    const testimonials = await this.prismaService.testimonial.findMany({
      select: {
        createdAt: true,
      },
    });

    const groupedResults = testimonials.reduce(
      (acc, testimonial) => {
        const date = testimonial.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date]++;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Transform the results into an array of { date, count }
    return Object.entries(groupedResults).map(([date, count]) => ({
      date,
      count,
    }));
  }

  async getTestimonialStats(userId: string) {
    const count = await this.prismaService.testimonial.count({
      where: {
        workspace: {
          ownerId: userId,
        },
      },
    });
    let sum = 0;
    const testimonials = await this.prismaService.testimonial.findMany({
      where: {
        workspace: {
          ownerId: userId,
        },
      },
    });
    testimonials.map((testimonial) => (sum += testimonial.ratings));
    const avg = (sum / count).toFixed(2);

    return {
      count,
      avg,
    };
  }
}
