'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { CreateWorkspaceFormInputs } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { createWorkspace } from '@/lib/actions';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { PlusCircle } from 'lucide-react';
import FormField from '@/components/FormField';

export function CreateWorkspaceForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateWorkspaceFormInputs>({
    resolver: zodResolver(createWorkspaceSchema),
  });

  const { data: session } = useSession();
  const onSubmit = async (data: CreateWorkspaceFormInputs) => {
    if (!session) {
      toast.error('You need to be logged in to create a workspace');
      return;
    }
    data.ownerId = session?.user?.id as number;
    const response = await createWorkspace(data);
    if (response) {
      if (response.status === 'success') {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create a workspace</DialogTitle>
            <DialogDescription>
              Start creating a specific workspace for your projects
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start  gap-4">
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
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
