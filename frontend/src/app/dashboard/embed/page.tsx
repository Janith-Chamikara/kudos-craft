'use client';

import { useState } from 'react';
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

const testimonials = [
  {
    id: 1,
    author: 'John Doe',
    content:
      'This product is amazing! It has completely transformed my workflow.',
  },
  {
    id: 2,
    author: 'Jane Smith',
    content:
      'I cannot recommend this service enough. The team is incredibly responsive and helpful.',
  },
  {
    id: 3,
    author: 'Mike Johnson',
    content: 'Absolutely love it! This has saved me countless hours of work.',
  },
  {
    id: 4,
    author: 'Emily Brown',
    content:
      'The attention to detail is impressive. Every feature is well thought out.',
  },
  {
    id: 5,
    author: 'Alex Lee',
    content: 'Customer support is top-notch. They go above and beyond to help.',
  },
];

const styles = [
  { id: 'carousel', name: 'Infinite Moving Carousel' },
  { id: 'grid', name: 'Grid Layout' },
  { id: 'cards', name: 'Card Testimonials' },
  { id: 'quotes', name: 'Quote Testimonials' },
];

export default function TestimonialStylesPage() {
  const [selectedStyle, setSelectedStyle] = useState(styles[0].id);
  const [framework, setFramework] = useState('nextjs');
  const [currentStep, setCurrentStep] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const handleCopyCode = () => {
    const code = document.querySelector('pre')?.textContent;
    if (code) {
      navigator.clipboard
        .writeText(code)
        .then(() => alert('Code copied to clipboard!'))
        .catch((err) => console.error('Failed to copy code: ', err));
    }
  };
  const steps = [
    {
      title: 'Select a Style',
      content:
        'Choose your preferred testimonial display style from the dropdown menu.',
      action: () => {},
    },
    {
      title: 'Choose Framework',
      content: 'Select whether you want to use Next.js or plain HTML/CSS.',
      action: () => {},
    },
    {
      title: 'Copy the Code',
      content: 'Copy the provided code for your selected style and framework.',
      action: handleCopyCode,
    },
    {
      title: 'Implement',
      content: 'Paste the code into your project and customize as needed.',
      action: () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      },
    },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      steps[currentStep + 1].action();
    } else {
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between gap-2 md:items-center mb-6">
        <h1 className="text-2xl font-bold">Testimonials</h1>

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
      <div className="">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Code Preview</h2>
          <CodePreview style={selectedStyle} framework={framework} />
          <Button onClick={handleCopyCode} className="mt-4">
            Copy Code
          </Button>
        </div>
      </div>
    </div>
  );
}
