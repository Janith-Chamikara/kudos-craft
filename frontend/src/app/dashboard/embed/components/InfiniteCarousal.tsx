'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  author: string;
  content: string;
}

interface InfiniteCarouselProps {
  testimonials: Testimonial[];
}

export function InfiniteCarousel({ testimonials }: InfiniteCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollWidth = container.scrollWidth;
    const animateScroll = () => {
      if (container.scrollLeft >= scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 1;
      }
    };
    const animationId = setInterval(animateScroll, 50);
    return () => clearInterval(animationId);
  }, []);

  return (
    <div className="overflow-hidden" ref={containerRef}>
      <motion.div className="flex">
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-64 p-4 border shadow-md rounded-md mx-2"
          >
            <p className="text-gray-200">{testimonial.content}</p>
            <p className="mt-2 font-bold">{testimonial.author}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
