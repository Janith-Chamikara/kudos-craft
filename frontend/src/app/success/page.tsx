import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function SuccessPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const session = await stripe.checkout.sessions.retrieve(
    searchParams?.session_id as string,
  );

  const jsonString = JSON.stringify(session, null, 2);

  return (
    <main className="flex min-w-screen min-h-screen items-center justify-center">
      <div className="flex flex-col gap-6 p-6 border items-center justify-center">
        <h1 className="mt-[35vh] mb-3 scroll-m-20  text-5xl font-semibold tracking-tight transition-colors first:mt-0">
          Welcome to Nextjs Starter Kit 🎉
        </h1>
        <p className="leading-7 text-center w-[60%]">Let&apos;s get cooking</p>
        <Link href="/dashboard" className="mt-4">
          <Button>Access Dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
