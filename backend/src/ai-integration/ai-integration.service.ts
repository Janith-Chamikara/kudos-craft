import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiIntegrationService {
  private genAI: GoogleGenerativeAI;
  private model: any; // We'll use 'any' for now, but you might want to create a proper type for this

  constructor(private configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.getOrThrow('GEMINI_API_KEY'),
    );
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async classifyTestimonial(
    testimonial: string,
    ratings: number,
  ): Promise<'positive' | 'negative' | 'neutral'> {
    try {
      const prompt = `Classify the following testimonial as either 'positive'or 'negative'. The given number represents the ratings given by the client. Respond with only one word: either 'positive' or 'negative'.

Testimonial: ${testimonial}
Ratings: ${ratings}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);

      if (text.toLowerCase().includes('positive')) {
        return 'positive';
      } else if (text.toLowerCase().includes('negative')) {
        return 'negative';
      } else {
        return 'neutral';
      }
    } catch (error) {
      console.error('Error classifying testimonial:', error);
      return 'neutral'; // Default to neutral in case of an error
    }
  }
}
