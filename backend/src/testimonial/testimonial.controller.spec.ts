import { Test, TestingModule } from '@nestjs/testing';
import { TestimonialController } from './testimonial.controller';

describe('TestimonialController', () => {
  let controller: TestimonialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestimonialController],
    }).compile();

    controller = module.get<TestimonialController>(TestimonialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
