'use client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useSearchParams } from 'next/navigation';
import { LinkShareDialog } from './components/LinkShareDialog';
import { useEffect, useState } from 'react';
import { getAllTestimonialsByWorkspaceId } from '@/lib/actions';
import { Testimonial } from '@/lib/types';
import toast from 'react-hot-toast';

export default function Workspaces() {
  const { id } = useParams();
  console.log(process.env.NEXT_PUBLIC_FRONTEND_URL);
  const searchParams = useSearchParams();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isFetched, setIsFetched] = useState<boolean>(false);

  console.log(testimonials);

  const fetchedTestimonials = async () => {
    if (!id) {
      toast.error('Invalid workspace id');
      return;
    }
    const response = await getAllTestimonialsByWorkspaceId(id as string);
    const fetchedTestimonials = (response?.data as Testimonial[]) ?? [];
    setTestimonials(fetchedTestimonials);
  };

  useEffect(() => {
    fetchedTestimonials();
  }, [isFetched]);

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
        <ul className="flex flex-row gap-4 flex-wrap">
          {testimonials.length > 1 ? (
            testimonials.map((workspace) => (
              <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">
                    {workspace.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm ">{workspace.review}</div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-sm">
              It seems you don't have any testimonials for this workspace yet
            </p>
          )}
        </ul>
      </div>
    </main>
  );
}
