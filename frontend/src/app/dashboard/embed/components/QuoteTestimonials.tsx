interface Testimonial {
  id: number;
  author: string;
  content: string;
}

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
          <p className="mb-2">{testimonial.content}</p>
          <footer className="text-right">
            — <cite>{testimonial.author}</cite>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
