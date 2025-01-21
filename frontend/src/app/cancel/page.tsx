import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PaymentCancelled from './components/Cancelled';

export default function Cancel() {
  return (
    <main className="flex min-w-screen min-h-screen items-center justify-center">
      <PaymentCancelled />
    </main>
  );
}
