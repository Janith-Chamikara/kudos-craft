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
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { createWorkspaceSchema } from '@/schemas/schema';
import { CreateWorkspaceFormInputs, Status, Workspace } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { createWorkspace, getWorkspaceById } from '@/lib/actions';
import { Edit, PlusCircle } from 'lucide-react';
import FormField from '@/components/FormField';
import { useEffect, useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const form = useForm<CreateWorkspaceFormInputs>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = form;

  useEffect(() => {
    if (isEditForm && workspaceId) {
      const fetchWorkspaceById = async (id: string) => {
        try {
          const response = await getWorkspaceById(id);
          if (response?.status === 'success') {
            const workspace = response.data as Workspace;
            reset({
              name: workspace.name,
              description: workspace.description || '',
            });
          }
        } catch (error) {
          toast.error('Failed to fetch workspace data');
        }
      };
      fetchWorkspaceById(workspaceId);
    }
  }, [isEditForm, workspaceId]);

  const onSubmit = async (data: CreateWorkspaceFormInputs) => {
    if (!session) {
      toast.error('You need to be logged in to manage workspaces');
      return;
    }

    try {
      data.ownerId = session.user.id as number;
      const response = await createWorkspace(data);

      if (response?.status === 'success') {
        toast.success(response.message || 'Workspace created successfully');
        setIsOpen(false);
        setTimeout(() => {
          refetch();
        }, 100);
      } else {
        toast.error(response?.message || 'Failed to create workspace');
      }
    } catch (error) {
      toast.error('An error occurred while managing the workspace');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isEditForm ? 'outline' : 'default'}
          className={`w-${isEditForm ? 'full' : 'max'} justify-center md:justify-start`}
        >
          {isEditForm ? (
            <Edit className="md:mr-2 h-4 w-4" />
          ) : (
            <PlusCircle className="md:mr-2 h-4 w-4" />
          )}
          <span className="hidden md:block">
            {isEditForm ? 'Edit' : 'New Workspace'}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="dialog-description"
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEditForm ? 'Edit' : 'Create'} workspace
            </DialogTitle>
            {isEditForm ? (
              <DialogDescription>
                Start editing this workspace
              </DialogDescription>
            ) : (
              <DialogDescription>
                Start creating your workspace
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="name">Name</Label>
              <FormField
                type="text"
                placeholder="My New Workspace"
                name="name"
                register={register}
                error={errors.name}
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="description">Description</Label>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditForm ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
