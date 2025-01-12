import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Testimonial {
  id: number;
  author: string;
  content: string;
}

interface CardTestimonialsProps {
  testimonials: Testimonial[];
}

export function CardTestimonials({ testimonials }: CardTestimonialsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id}>
          <CardHeader>
            <CardTitle>{testimonial.author}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{testimonial.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
