'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { CreateWorkspaceForm } from '../components/CreateWorkspceFormDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { getAllWorkspaces } from '@/lib/actions';
import { Workspace } from '@/lib/types';
import { Intro } from '@/components/Intro';

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const router = useRouter();

  const fetchWorkspaces = async () => {
    const response = await getAllWorkspaces();
    const fetchedWorkspaces = (response?.data as Workspace[]) ?? [];
    setWorkspaces(fetchedWorkspaces);
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [isFetched]);

  const handleWorkspaceCreated = () => {
    fetchWorkspaces();
    router.refresh();
  };

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
      </div>
    </main>
  );
}
