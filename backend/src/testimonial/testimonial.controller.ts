import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialDto } from './dto/testimonial.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('testimonial')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}
  @Public()
  @Post('create')
  async createTestimonialHandler(
    @Body()
    testimonialDto: TestimonialDto,
  ) {
    return this.testimonialService.createTestimonial(testimonialDto);
  }

  @Post('share')
  async shareTestimonialHandler(
    @Body() data: { email: string; workspaceId: string },
  ) {
    return this.testimonialService.shareTestimonial(
      data.workspaceId,
      data.email,
    );
  }

  @Get('/admin/get-all')
  async getTestimonialsHandler() {
    return this.testimonialService.getTestimonials();
  }

  @Get('get-all')
  async getTestimonialsByUserIdHandler(@Query('userId') userId: string) {
    return this.testimonialService.getTestimonialsByUserId(userId);
  }
  @Get('analyze')
  async analyzeTestimonialHandler(@Query('userId') userId: string) {
    return this.testimonialService.analyzeTestimonials(userId);
  }

  @Put('update')
  async updateTestimonialHandler(
    @Query('testimonialId') testimonialId: string,
    @Body() updatedTestimonialContent: Partial<TestimonialDto>,
  ) {
    return this.testimonialService.updateTestimonial(
      testimonialId,
      updatedTestimonialContent,
    );
  }
  @Delete('delete')
  async deleteTestimonialHandler(
    @Query('testimonialId') testimonialId: string,
  ) {
    return this.testimonialService.deleteTestimonial(testimonialId);
  }
  @Post('/workspace/get-all')
  async getTestimonialsByWorkspaceIdHandler(
    @Query('workspaceId') workspaceId: string,
    @Body()
    filters: {
      dateRange?: {
        from: Date;
        to: Date;
      };
      searchQuery?: string;
    },
  ) {
    return this.testimonialService.getTestimonialsByWorkspaceId(
      workspaceId,
      filters,
    );
  }
  @Get('sentiment-over-time')
  getSentimentOverTime() {
    return this.testimonialService.getSentimentOverTime();
  }

  @Get('count-over-time')
  getTestimonialsOverTime() {
    return this.testimonialService.getTestimonialsOverTime();
  }

  @Get('get-stats')
  async getTestimonialStatsHandler(@Query('userId') userId: string) {
    return this.testimonialService.getTestimonialStats(userId);
  }
}
