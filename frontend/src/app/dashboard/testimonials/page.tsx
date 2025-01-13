'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { Status, Testimonial } from '@/lib/types';
import {
  analyzeAllTestimonialsByWorkspaceId,
  getAllTestimonials,
} from '@/lib/actions';
import Loader from '@/components/Loader';
import { TestimonialCard } from '../components/Testimonial';
import { Intro } from '@/components/Intro';
import { Button } from '@/components/ui/button';
import { FaChartLine } from 'react-icons/fa';

export default function Workspaces() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<Status | undefined>({
    queryKey: ['testimonials'],
    queryFn: () => getAllTestimonials(),
  });
  const testimonials = (data?.data as Testimonial[]) ?? [];
  const onClick = async () => {
    setIsAnalyzing(true);
    try {
      const response = await analyzeAllTestimonialsByWorkspaceId();
      console.log(response);
      if (response?.status === 'success') {
        await refetch();
      }
    } catch (error) {
      console.error('Error analyzing testimonials:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getBackgroundColor = (sentiment: string | null | undefined) => {
    if (sentiment === 'positive') {
      return 'bg-green-100 dark:bg-green-900/20';
    } else if (sentiment === 'negative') {
      return 'bg-red-100 dark:bg-red-900/20';
    }
    return '';
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-2 md:items-center mb-6">
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <div className="flex space-x-2">
            <Input placeholder="Search..." className="w-64" />
            <Button
              onClick={onClick}
              className="flex items-center space-x-2"
              disabled={isAnalyzing}
            >
              <FaChartLine className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
            </Button>
          </div>
        </div>
        <Intro
          topic="Testimonials"
          name="hasSeenTestimonialIntro"
          title="Client Testimonials showcase the valuable feedback and reviews from your clients for each workspace."
          steps={[
            'View detailed feedback provided by your clients for completed work.',
            'Easily manage and showcase testimonials specific to each project or workspace.',
          ]}
        />
        <Loader isLoading={isLoading || isAnalyzing}>
          <div className="flex flex-col md:flex-row w-full gap-4">
            {/* Positive Testimonials */}
            <div className="flex-1 p-2 border rounded-sm">
              <h2 className="text-md font-semibold mb-2">Positive Reviews</h2>
              <ul className="flex flex-col gap-4">
                {testimonials.filter((t) => t.sentiment === 'positive').length >
                0 ? (
                  testimonials
                    .filter(
                      (testimonial) => testimonial.sentiment === 'positive',
                    )
                    .map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className={`${getBackgroundColor(testimonial.sentiment)} transition-colors duration-300 rounded-lg overflow-hidden`}
                      >
                        <TestimonialCard
                          getBackgroundColor={getBackgroundColor}
                          testimonial={testimonial}
                        />
                      </div>
                    ))
                ) : (
                  <p className="text-sm">
                    No positive testimonials available for this workspace yet.
                  </p>
                )}
              </ul>
            </div>

            {/* Negative Testimonials */}
            <div className="flex-1 p-2 border rounded-sm">
              <h2 className="text-md font-semibold mb-2">Negative Reviews</h2>
              <ul className="flex flex-col gap-4">
                {testimonials.filter((t) => t.sentiment === 'negative').length >
                0 ? (
                  testimonials
                    .filter(
                      (testimonial) => testimonial.sentiment === 'negative',
                    )
                    .map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className={`${getBackgroundColor(testimonial.sentiment)} transition-colors duration-300 rounded-lg overflow-hidden`}
                      >
                        <TestimonialCard
                          getBackgroundColor={getBackgroundColor}
                          testimonial={testimonial}
                        />
                      </div>
                    ))
                ) : (
                  <p className="text-sm">
                    No negative testimonials available for this workspace yet.
                  </p>
                )}
              </ul>
            </div>
          </div>
          {testimonials.filter((t) => !t.isAnalyzed).length > 0 && (
            <div className="flex-1 p-2 border mt-4 rounded-sm">
              <h2 className="text-md font-semibold mb-2">Not analyzed yet</h2>
              <ul className="flex flex-col gap-4">
                {testimonials
                  .filter((t) => !t.isAnalyzed)
                  .map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="transition-colors duration-300 rounded-lg overflow-hidden"
                    >
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  ))}
              </ul>
            </div>
          )}
        </Loader>
      </div>
    </main>
  );
}
