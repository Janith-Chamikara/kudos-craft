import { Testimonial } from '@/lib/types';

interface QuoteTestimonialsProps {
  testimonials: Testimonial[];
}

export function QuoteTestimonials({ testimonials }: QuoteTestimonialsProps) {
  return (
    <div className="space-y-8">
      {testimonials.map((testimonial) => (
        <blockquote
          key={testimonial.id}
          className="italic border-l-4 border-gray-300 pl-4"
        >
          <p className="mb-2">{testimonial.review}</p>
          <footer className="text-right">
            — <cite>{testimonial.name}</cite>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
