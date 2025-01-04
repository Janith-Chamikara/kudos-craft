import { Body, Controller, Get, Post } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialDto } from './dto/testimonial.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('testimonial')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}
  @Public()
  @Post('create')
  async createTestimonial(
    @Body()
    testimonialDto: TestimonialDto,
  ) {
    return this.testimonialService.createWorkspace(testimonialDto);
  }

  @Get('get-all')
  async getTestimonials() {
    return this.testimonialService.getTestimonials();
  }
  @Get('/workspace/get-all')
  async getTestimonialsByWorkspaceId(@Body() workspaceId: string) {
    return this.testimonialService.getTestimonialsByWorkspaceId(workspaceId);
  }
}
