import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

  @Get('get-all')
  async getTestimonialsHandler() {
    return this.testimonialService.getTestimonials();
  }
  @Get('/workspace/get-all')
  async getTestimonialsByWorkspaceIdHandler(
    @Query('workspaceId') workspaceId: string,
  ) {
    return this.testimonialService.getTestimonialsByWorkspaceId(workspaceId);
  }
}
