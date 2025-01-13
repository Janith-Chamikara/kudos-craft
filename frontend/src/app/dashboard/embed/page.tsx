'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CodePreview } from './components/CodePreview';
import { InfiniteCarousel } from './components/InfiniteCarousal';
import { GridLayout } from './components/GridLayout';
import { CardTestimonials } from './components/CardTestimonials';
import { QuoteTestimonials } from './components/QuoteTestimonials';
import { getAllTestimonials } from '@/lib/actions';
import { Testimonial } from '@/lib/types';
import { Intro } from '@/components/Intro';

const styles = [
  { id: 'carousel', name: 'Infinite Moving Carousel' },
  { id: 'grid', name: 'Grid Layout' },
  { id: 'cards', name: 'Card Testimonials' },
  { id: 'quotes', name: 'Quote Testimonials' },
];

export default function TestimonialStylesPage() {
  const [selectedStyle, setSelectedStyle] = useState(styles[0].id);
  const [framework, setFramework] = useState('nextjs');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await getAllTestimonials();
        if (response?.status === 'success') {
          setTestimonials(response.data as Testimonial[]);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);
  const handleCopyCode = () => {
    const code = document.querySelector('pre')?.textContent;
    if (code) {
      navigator.clipboard
        .writeText(code)
        .then(() => alert('Code copied to clipboard!'))
        .catch((err) => console.error('Failed to copy code: ', err));
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between gap-2 md:items-center mb-6">
        <h1 className="text-2xl font-bold">Testimonial Display Styles</h1>

        <div className="flex space-x-4">
          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              {styles.map((style) => (
                <SelectItem key={style.id} value={style.id}>
                  {style.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs value={framework} onValueChange={setFramework}>
            <TabsList>
              <TabsTrigger value="nextjs">Next.js</TabsTrigger>
              <TabsTrigger value="html">HTML/CSS</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <Intro
        topic="Testimonials Embedding"
        name="hasSeenEmbeddingIntro"
        title="Client Testimonials showcase the valuable feedback and reviews from your clients for each workspace."
        steps={[
          'View detailed feedback provided by your clients for completed work.',
          'Easily manage and showcase testimonials specific to each project or workspace.',
        ]}
      />
      <div>
        <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedStyle === 'carousel' && (
              <InfiniteCarousel testimonials={testimonials} />
            )}
            {selectedStyle === 'grid' && (
              <GridLayout testimonials={testimonials} />
            )}
            {selectedStyle === 'cards' && (
              <CardTestimonials testimonials={testimonials} />
            )}
            {selectedStyle === 'quotes' && (
              <QuoteTestimonials testimonials={testimonials} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div>
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">Code Preview</h2>
          <CodePreview style={selectedStyle} framework={framework} />
          <Button onClick={handleCopyCode} className="mt-4">
            Copy Code
          </Button>
        </div>
      </div>
    </div>
  );
}
