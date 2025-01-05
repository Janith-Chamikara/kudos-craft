'use client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useSearchParams } from 'next/navigation';
import { LinkShareDialog } from './components/LinkShareDialog';
import { useEffect, useState } from 'react';
import { getAllTestimonialsByWorkspaceId } from '@/lib/actions';
import { Status, Testimonial } from '@/lib/types';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';

export default function Workspaces() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const { data, isLoading, error } = useQuery<Status | undefined>({
    queryKey: ['workspaces'],
    queryFn: () => getAllTestimonialsByWorkspaceId(id as string),
  });
  const testimonials = (data?.data as Testimonial[]) ?? [];

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {searchParams.get('name')} / Testimonials
          </h1>
          <div className="flex space-x-2">
            <Input placeholder="Search..." className="w-64" />
            <LinkShareDialog
              link={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/create-review?workspaceId=${id}`}
              description="test"
              title="test"
            />
          </div>
        </div>
        <Loader isLoading={isLoading}>
          <ul className="flex justify-start flex-row gap-4 flex-wrap">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-medium">
                      {testimonial.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm ">{testimonial.review}</div>
                  </CardContent>
                </Card>
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
