'use client';

import { useState } from 'react';
import { useClipboard } from 'use-clipboard-copy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Check, Copy } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requestTestimonialSchema } from '@/schemas/schema';
import { RequestTestimonialFormInputs } from '@/lib/types';
import { cn } from '@/lib/utils';
import FormField from '@/components/FormField';
import { requestReviewBySendingEmail } from '@/lib/actions';
import toast from 'react-hot-toast';

interface LinkShareDialogProps {
  link: string;
  workspaceId: string;
}

export function LinkShareDialog({ link, workspaceId }: LinkShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const clipboard = useClipboard({
    copiedTimeout: 2000,
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestTestimonialFormInputs>({
    resolver: zodResolver(requestTestimonialSchema),
  });
  const handleCopy = () => {
    clipboard.copy(link);
    setIsCopied(true);
  };

  const onSubmit = async (data: RequestTestimonialFormInputs) => {
    const requiredData = {
      email: data.email,
      workspaceId: workspaceId,
    };

    const response = await requestReviewBySendingEmail(requiredData);
    if (response?.status === 'success') {
      toast.success(
        response.message || 'Successfully sent an email to your client',
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Share Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request a review from your client</DialogTitle>
          <DialogDescription>
            Share the below link with your client you wish to get a review from
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-between w-full">
          <div>
            <Input
              id="link"
              defaultValue={link}
              readOnly
              className="min-w-[350px] w-full"
            />
          </div>
          <Button type="submit" size="sm" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-center">or</p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Label>Email of your client</Label>
          <FormField
            register={register}
            name="email"
            error={errors.email}
            placeholder="johndoe@gmail.com"
          />
          <DialogFooter>
            {' '}
            <Button disabled={isSubmitting} type="submit">
              Send an email
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
