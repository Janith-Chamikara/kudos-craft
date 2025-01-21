'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { deleteWorkspace } from '@/lib/actions';
import { MdDeleteOutline } from 'react-icons/md';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Status } from '@/lib/types';

type Props = {
  workspaceId: string;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<Status | undefined, Error>>;
};

export function DeleteWorkspaceDialog({ workspaceId, refetch }: Props) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onSubmit = async () => {
    if (!session) {
      toast.error('You need to be logged in to delete a workspace');
      return;
    }
    setIsDeleting(true);
    try {
      const response = await deleteWorkspace(workspaceId);
      if (response?.status === 'success') {
        toast.success('Successfully deleted workspace');
        setIsOpen(false);
        setTimeout(() => {
          refetch();
        }, 100);
      } else {
        toast.error(response?.message || 'Failed to delete workspace');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the workspace');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex justify-start">
          <MdDeleteOutline className="md:mr-2 h-4 w-4" />
          <span className="hidden md:block">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Workspace</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this workspace? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
