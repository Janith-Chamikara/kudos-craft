interface Testimonial {
  id: number;
  author: string;
  content: string;
}

interface GridLayoutProps {
  testimonials: Testimonial[];
}

export function GridLayout({ testimonials }: GridLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-white p-4 rounded-md shadow-md">
          <p className="text-gray-600">{testimonial.content}</p>
          <p className="mt-2 font-bold">{testimonial.author}</p>
        </div>
      ))}
    </div>
  );
}
