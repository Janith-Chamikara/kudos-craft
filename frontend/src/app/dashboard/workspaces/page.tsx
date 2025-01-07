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
import { HiDotsHorizontal } from 'react-icons/hi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FaArrowRight } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { DeleteWorkspaceDialog } from '../components/DeleteWorkspaceDialog';

export default function Workspaces() {
  const [isFetched, setIsFetched] = useState<boolean>(false);

  const { data, isLoading, error, refetch } = useQuery<Status | undefined>({
    queryKey: ['workspaces'],
    queryFn: () => getAllWorkspaces(),
  });
  const workspaces = (data?.data as Workspace[]) ?? [];
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-2 md:items-center mb-6">
          <h1 className="text-2xl font-bold">Workspaces</h1>
          <div className="flex space-x-2">
            <Input placeholder="Search..." className="w-64" />
            <CreateWorkspaceForm refetch={refetch} />
          </div>
        </div>
        <Intro />
        <Loader isLoading={isLoading}>
          <ul className="flex flex-row gap-4 flex-wrap">
            {workspaces.map((workspace) => (
              <Card
                key={workspace.id}
                className="cursor-pointer w-full  hover:shadow-md transition-shadow duration-200"
              >
                <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">
                    {workspace.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/workspaces/${workspace.id}?name=${workspace.name}`}
                      key={workspace.id}
                    >
                      {' '}
                      <Button variant="outline">
                        <span className="hidden md:block">
                          View testimonials
                        </span>
                        <FaArrowRight className="w-5 h-5 md:hidden" />
                      </Button>{' '}
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <HiDotsHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="flex flex-col">
                        <CreateWorkspaceForm
                          refetch={refetch}
                          isEditForm={true}
                          workspaceId={workspace.id}
                        />
                        <DeleteWorkspaceDialog
                          workspaceId={workspace.id}
                          refetch={refetch}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm ">{workspace.description}</div>
                </CardContent>
              </Card>
            ))}
          </ul>
        </Loader>
      </div>
    </main>
  );
}
