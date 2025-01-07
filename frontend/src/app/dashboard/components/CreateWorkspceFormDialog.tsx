'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { createWorkspaceSchema } from '@/schemas/schema';
import { CreateWorkspaceFormInputs, Status, Workspace } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { createWorkspace, getWorkspaceById } from '@/lib/actions';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Edit, PlusCircle } from 'lucide-react';
import FormField from '@/components/FormField';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

type Props = {
  isEditForm?: boolean;
  workspaceId?: string;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<Status | undefined, Error>>;
};

export function CreateWorkspaceForm({
  isEditForm = false,
  workspaceId,
  refetch,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateWorkspaceFormInputs>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    if (isEditForm) {
      if (!workspaceId || workspaceId === undefined) {
        toast.error('Workspace id not found');
        return;
      }
      const fetchWorkspaceById = async (id: string) => {
        const response = await getWorkspaceById(id);
        if (response?.status === 'success') {
          const workspace = response.data as Workspace;
          reset({
            name: workspace.name,
            description: workspace.description as string,
          });
        }
        return;
      };
      fetchWorkspaceById(workspaceId);
    }
  }, [isEditForm, workspaceId]);

  const { data: session } = useSession();

  const onSubmit = async (data: CreateWorkspaceFormInputs) => {
    if (!session) {
      toast.error('You need to be logged in to delete a workspace');
      return;
    }

    try {
      data.ownerId = session?.user?.id as number;
      const response = await createWorkspace(data);
      if (response?.status === 'success') {
        toast.success(response.message || 'Workspace created successfully');
        setIsOpen(false);
        await refetch();
      } else {
        toast.error(response?.message || 'Failed to create workspace');
      }
    } catch (error) {
      toast.error('An error occurred while create the workspace');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={isEditForm ? 'outline' : 'default'}>
          {isEditForm ? (
            <Edit className="md:mr-2 h-4 w-4" />
          ) : (
            <PlusCircle className="md:mr-2 h-4 w-4" />
          )}
          <span className="hidden md:block">
            {isEditForm ? 'Edit ' : 'New Workspace'}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEditForm ? 'Edit ' : 'Create '} a workspace
            </DialogTitle>
            {!isEditForm && (
              <DialogDescription>
                Start creating a specific workspace for your projects
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <FormField
                type="text"
                placeholder="My New Workspace"
                name="name"
                register={register}
                error={errors.name}
              />
            </div>
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <FormField
                type="text"
                isTextArea
                placeholder="A short description of your workspace"
                name="description"
                register={register}
                error={errors.description}
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isSubmitting} type="submit">
              {isEditForm ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
