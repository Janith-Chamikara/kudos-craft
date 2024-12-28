import ClientReviewForm from './components/ClientReviewForm';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold mb-4">
        User is requesting a review from you
      </h1>
      <ClientReviewForm />
    </div>
  );
}
