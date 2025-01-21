import Stripe from 'stripe';
import PaymentSuccess from './components/Success';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function SuccessPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const session = await stripe.checkout.sessions.retrieve(
    searchParams?.session_id as string,
  );

  return (
    <main className="flex min-w-screen min-h-screen items-center justify-center">
      <PaymentSuccess />
    </main>
  );
}
