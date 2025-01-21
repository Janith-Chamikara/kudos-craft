'use client';

import { motion } from 'framer-motion';
import { X, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function PaymentCancelled() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-center justify-center min-h-[400px] p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto rounded-full bg-red-100 p-3 mb-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="rounded-full bg-red-200 p-3"
            >
              <div className="rounded-full bg-red-500 p-2">
                <X className="h-6 w-6 text-white" />
              </div>
            </motion.div>
          </motion.div>
          <CardTitle className="text-center text-2xl font-bold">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-muted-foreground">
              Your payment has been cancelled. No charges have been made to your
              account.
            </p>
          </motion.div>
        </CardContent>
        <CardFooter>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="w-full"
          >
            <Link href={'/#pricing'}>
              <Button variant="outline" className="w-full">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
