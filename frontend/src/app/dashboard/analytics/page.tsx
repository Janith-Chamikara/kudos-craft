'use client';
import { Input } from '@/components/ui/input';
import { getAllTestimonialsByWorkspaceId } from '@/lib/actions';
import { Status, Testimonial } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { Intro } from '@/components/Intro';
import { useState } from 'react';
import { FilterDropdown, FilterState } from '@/components/FilterDropdown';
import TestimonialsCountChart from './components/TestimonialCountChart';
import SentimentChart from './components/SentimentChart';

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
