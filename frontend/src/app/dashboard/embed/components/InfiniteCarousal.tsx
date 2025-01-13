'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Testimonial } from '@/lib/types';

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
            <p className="text-muted-foreground">{testimonial.review}</p>
            <p className="mt-2 font-semibold">{testimonial.name}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
