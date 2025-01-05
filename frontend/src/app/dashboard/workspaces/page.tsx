'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { CreateWorkspaceForm } from '../components/CreateWorkspceFormDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { getAllWorkspaces } from '@/lib/actions';
import { Status, Workspace } from '@/lib/types';
import { Intro } from '@/components/Intro';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';

export default function Workspaces() {
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const router = useRouter();

  const { data, isLoading, error } = useQuery<Status | undefined>({
    queryKey: ['workspaces'],
    queryFn: () => getAllWorkspaces(),
  });
  console.log(data);
  const workspaces = (data?.data as Workspace[]) ?? [];
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Workspaces</h1>
          <div className="flex space-x-2">
            <Input placeholder="Search..." className="w-64" />
            <CreateWorkspaceForm setIsFetched={setIsFetched} />
          </div>
        </div>
        <Intro />
        <Loader isLoading={isLoading}>
          <ul className="flex flex-row gap-4 flex-wrap">
            {workspaces.map((workspace) => (
              <Link
                href={`/dashboard/workspaces/${workspace.id}?name=${workspace.name}`}
                key={workspace.id}
              >
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
              </Link>
            ))}
          </ul>
        </Loader>
      </div>
    </main>
  );
}
