'use client';
import Loader from '@/components/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTestimonialStats, getWorkspaceStats } from '@/lib/actions';
import { useQueries, useQuery } from '@tanstack/react-query';
import { BarChart, Star, Users } from 'lucide-react';

export default function DashboardOverview() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['testimonialStats'],
        queryFn: () => getTestimonialStats(),
      },
      {
        queryKey: ['workspaceStats'],
        queryFn: () => getWorkspaceStats(),
      },
    ],
  });

  const [testimonialStats, workspaceStats] = results;
  console.log(workspaceStats.data?.data);
  console.log(testimonialStats.data?.data);
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Workspaces
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Loader size="sm" isLoading={results[0].isLoading}>
                <div className="text-2xl font-bold">
                  {(workspaceStats.data?.data as { count: number })?.count}
                </div>
              </Loader>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Testimonials
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Loader size="sm" isLoading={results[1].isLoading}>
                <div className="text-2xl font-bold">
                  {
                    (
                      testimonialStats.data?.data as {
                        count: number;
                        avg: number;
                      }
                    )?.count
                  }
                </div>
              </Loader>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Loader size="sm" isLoading={results[1].isLoading}>
                {' '}
                <div className="text-2xl font-bold">
                  {
                    (
                      testimonialStats.data?.data as {
                        count: number;
                        avg: number;
                      }
                    )?.avg
                  }
                </div>
              </Loader>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+28%</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">New testimonial received</p>
                <p className="text-sm text-muted-foreground">
                  John Smith left a 5-star review
                </p>
              </div>
            </li>
            <li className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">New workspace created</p>
                <p className="text-sm text-muted-foreground">
                  Marketing team added a new workspace
                </p>
              </div>
            </li>
            <li className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <BarChart className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Analytics report ready</p>
                <p className="text-sm text-muted-foreground">
                  Monthly performance report is available
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
