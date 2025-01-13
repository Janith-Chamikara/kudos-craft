import { Testimonial } from '@/lib/types';

interface GridLayoutProps {
  testimonials: Testimonial[];
}

export function GridLayout({ testimonials }: GridLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="border p-4 rounded-md shadow-md">
          <p className="text-muted-foreground">{testimonial.review}</p>
          <p className="mt-2 font-semibold">{testimonial.name}</p>
        </div>
      ))}
    </div>
  );
}
