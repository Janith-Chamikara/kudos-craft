import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Testimonial } from '@/lib/types';

interface CardTestimonialsProps {
  testimonials: Testimonial[];
}

export function CardTestimonials({ testimonials }: CardTestimonialsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id}>
          <CardHeader>
            <CardTitle>{testimonial.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{testimonial.review}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
