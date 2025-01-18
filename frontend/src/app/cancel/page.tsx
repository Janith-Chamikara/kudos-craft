import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Cancel() {
  return (
    <main className="flex min-w-screen min-h-screen items-center justify-center">
      <div className="flex flex-col gap-6 p-6 border">
        <h1 className="mt-[20rem] scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Payment Cancelled 😢
        </h1>
        <p className="leading-7">The good news is, you can try again 😊</p>
        <div className="mt-5">
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
