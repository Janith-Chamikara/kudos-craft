'use client';

import { Intro } from '@/components/Intro';
import TestimonialsCountChart from './components/TestimonialCountChart';

export default function Workspaces() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <div className="flex space-x-2"></div>
        </div>
        <Intro
          topic="Analytics"
          name="hasSeenTestimonialIntro"
          title="Client Testimonials showcase the valuable feedback and reviews from your clients for each workspace."
          steps={[
            'View detailed feedback provided by your clients for completed work.',
            'Easily manage and showcase testimonials specific to each project or workspace.',
          ]}
        />
        <TestimonialsCountChart />
      </div>
    </main>
  );
}
