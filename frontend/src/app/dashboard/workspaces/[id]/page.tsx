'use client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LinkShareDialog } from './components/LinkShareDialog';

export default async function Workspaces() {
  const { id } = useParams();
  const searchParams = useSearchParams();
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
              link="http://test"
              description="test"
              title="test"
            />
          </div>
        </div>
        <ul className="flex flex-row gap-4 flex-wrap">
          {[
            {
              id: 1,
              name: 'Personal Projects',
              description: 'My personal workspace',
            },
            {
              id: 2,
              name: 'Team Alpha',
              description: 'Collaborative workspace for Team Alpha',
            },
            {
              id: 3,
              name: 'Client XYZ',
              description: 'Projects for Client XYZ',
            },
            {
              id: 3,
              name: 'Client XYZ',
              description: 'Projects for Client XYZ',
            },
            {
              id: 3,
              name: 'Client XYZ',
              description: 'Projects for Client XYZ',
            },
            {
              id: 3,
              name: 'Client XYZ',
              description: 'Projects for Client XYZ',
            },
          ].map((workspace) => (
            <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">
                  {workspace.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm ">{workspace.description}</div>
              </CardContent>
            </Card>
          ))}
        </ul>
      </div>
    </main>
  );
}
