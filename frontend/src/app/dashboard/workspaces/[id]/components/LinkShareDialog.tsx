'use client';

import { useState } from 'react';
import { useClipboard } from 'use-clipboard-copy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Check, Copy } from 'lucide-react';

interface LinkShareDialogProps {
  link: string;
  title?: string;
  description?: string;
}

export function LinkShareDialog({
  link,
  title = 'Share Link',
  description = 'Copy this link to share',
}: LinkShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const clipboard = useClipboard({
    copiedTimeout: 2000,
  });

  const handleCopy = () => {
    clipboard.copy(link);
    setIsCopied(true);
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
      </DialogContent>
    </Dialog>
  );
}
