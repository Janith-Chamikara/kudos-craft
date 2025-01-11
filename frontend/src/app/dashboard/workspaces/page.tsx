'use client';

import { useState } from 'react';
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
import { FilterDropdown, FilterState } from '@/components/FilterDropdown';
import { format } from 'date-fns';

export default function Workspaces() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: undefined,
    searchQuery: '',
  });
  const { data, isLoading, refetch } = useQuery<Status | undefined>({
    queryKey: ['workspaces', filters],
    queryFn: () => getAllWorkspaces(filters),
  });

  const workspaces = (data?.data as Workspace[]) ?? [];

  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-2 md:items-center mb-6">
          <h1 className="text-2xl font-bold">Workspaces</h1>
          <div className="flex space-x-2">
            <Input
              placeholder="Search..."
              className="w-64"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
            />
            <CreateWorkspaceForm refetch={refetch} />
            <FilterDropdown onFilterApply={handleFilterApply} />
          </div>
        </div>
        <Intro
          topic="Workspaces"
          name="hasSeenWorkspaceIntro"
          title=" Workspaces in KudosCraft help you organize your projects and
                collaborate with your team."
          steps={[
            'Create multiple workspaces for different projects or teams',
            'Invite your clients to get a review for your work from him',
          ]}
        />
        <Loader isLoading={isLoading}>
          <ul className="flex flex-col gap-4">
            {workspaces?.length > 0 ? (
              workspaces.map((workspace) => (
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
                        <DropdownMenuContent className="flex flex-col gap-1">
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
                  <CardContent className="flex flex-col gap-4">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(workspace.createdAt), 'PPpp')}
                    </p>
                    <div className="text-sm ">{workspace.description}</div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm">
                Oops! We couldn't find any workspaces. It looks like you haven't
                created one yet. Please create a workspace to get started.
              </p>
            )}
          </ul>
        </Loader>
      </div>
    </main>
  );
}
