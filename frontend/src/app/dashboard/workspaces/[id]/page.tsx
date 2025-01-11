'use client';
import { Input } from '@/components/ui/input';
import { useParams, useSearchParams } from 'next/navigation';
import { LinkShareDialog } from './components/LinkShareDialog';
import { getAllTestimonialsByWorkspaceId } from '@/lib/actions';
import { Status, Testimonial } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import { TestimonialCard } from '../../components/Testimonial';
import { Intro } from '@/components/Intro';
import { useState } from 'react';
import { FilterDropdown, FilterState } from '@/components/FilterDropdown';

export default function Workspaces() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    dateRange: undefined,
    searchQuery: '',
  });

  const { data, isLoading, error } = useQuery<Status | undefined>({
    queryKey: ['testimonials', filters],
    queryFn: () => getAllTestimonialsByWorkspaceId(id as string, filters),
  });
  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters);
  };
  const testimonials = (data?.data as Testimonial[]) ?? [];
  console.log(testimonials);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {searchParams.get('name')} / Testimonials
          </h1>
          <div className="flex space-x-2">
            <Input
              placeholder="Search..."
              className="w-64"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
            />
            <LinkShareDialog
              link={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/create-review?workspaceId=${id}`}
              workspaceId={id as string}
            />
            <FilterDropdown onFilterApply={handleFilterApply} />
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

        <Loader isLoading={isLoading}>
          <ul className="flex flex-col w-full gap-4 ">
            {testimonials?.length > 0 ? (
              testimonials.map((testimonial) => (
                <TestimonialCard testimonial={testimonial} />
              ))
            ) : (
              <p className="text-sm">
                It seems you don't have any testimonials for this workspace yet
              </p>
            )}
          </ul>
        </Loader>
      </div>
    </main>
  );
}
