'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type PricingSwitchProps = {
  onSwitch: (value: string) => void;
};

type PricingCardProps = {
  user: any;
  handleCheckout: any;
  priceIdMonthly: any;
  priceIdYearly: any;
  isYearly?: boolean;
  title: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  description: string;
  features: string[];
  actionLabel: string;
  popular?: boolean;
  exclusive?: boolean;
};

const PricingHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <section className="text-center">
    <h1
      className={`text-2xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 font-semibold tracking-tight dark:text-white text-gray-900`}
    >
      {title}
    </h1>
    <p className="text-gray-600 dark:text-gray-400 pt-1">{subtitle}</p>
    <br />
  </section>
);

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="w-40 mx-auto" onValueChange={onSwitch}>
    <TabsList className="py-6 px-2">
      <TabsTrigger value="0" className="text-base">
        <p>Monthly</p>
      </TabsTrigger>
      <TabsTrigger value="1" className="text-base">
        <p>Yearly</p>
      </TabsTrigger>
    </TabsList>
  </Tabs>
);

const PricingCard = ({
  user,
  handleCheckout,
  isYearly,
  title,
  priceIdMonthly,
  priceIdYearly,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  actionLabel,
  popular,
  exclusive,
}: PricingCardProps) => {
  const router = useRouter();
  return (
    <Card
      className={cn(
        `w-72 flex flex-col justify-between py-1 ${popular ? 'border-rose-400' : 'border-zinc-700'} mx-auto sm:mx-0`,
      )}
    >
      <div>
        <CardHeader className="pb-8 pt-4">
          {isYearly && yearlyPrice && monthlyPrice ? (
            <div className="flex justify-between">
              <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
                {title}
              </CardTitle>
              <div
                className={cn(
                  'px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white',
                  {
                    'bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black ':
                      popular,
                  },
                )}
              >
                Save ${monthlyPrice * 12 - yearlyPrice}
              </div>
            </div>
          ) : (
            <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">
              {title}
            </CardTitle>
          )}
          <div className="flex gap-0.5">
            <h2 className="text-3xl font-bold">
              {yearlyPrice && isYearly
                ? '$' + yearlyPrice
                : monthlyPrice
                  ? '$' + monthlyPrice
                  : 'Custom'}
            </h2>
            <span className="flex flex-col justify-end text-sm mb-1">
              {yearlyPrice && isYearly
                ? '/year'
                : monthlyPrice
                  ? '/month'
                  : null}
            </span>
          </div>
          <CardDescription className="pt-1.5 h-12">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {features.map((feature: string) => (
            <CheckItem key={feature} text={feature} />
          ))}
        </CardContent>
      </div>
      <CardFooter className="mt-2">
        <Button
          onClick={() => {
            if (user?.id) {
              handleCheckout(isYearly ? priceIdYearly : priceIdMonthly, true);
            } else {
              toast('Please login or sign up to purchase', {
                description: 'You must be logged in to make a purchase',
                action: {
                  label: 'Sign Up',
                  onClick: () => {
                    router.push('/sign-up');
                  },
                },
              });
            }
          }}
          className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white px-6 font-medium dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          type="button"
        >
          <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b fr om-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle2 size={18} className="my-auto text-green-400" />
    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{text}</p>
  </div>
);

export default function Pricing() {
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const togglePricingPeriod = (value: string) =>
    setIsYearly(parseInt(value) === 1);
  const { data: session } = useSession();
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!));
  }, []);

  const handleCheckout = async (priceId: string, subscription: boolean) => {
    try {
      if (!session) return;
      const { data } = await axios.post(
        `/api/payments/create-checkout-session`,
        {
          userId: session.user?.id,
          email: session.user?.email,
          priceId,
          subscription,
        },
      );

      if (data.sessionId) {
        const stripe = await stripePromise;

        const response = await stripe?.redirectToCheckout({
          sessionId: data.sessionId,
        });

        return response;
      } else {
        console.error('Failed to create checkout session');
        toast('Failed to create checkout session');
        return;
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast('Error during checkout');
      return;
    }
  };

  const plans = [
    {
      title: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 50,
      description: 'Essential features you need to get started',
      features: [
        'Example Feature Number 1',
        'Example Feature Number 2',
        'Example Feature Number 3',
      ],
      priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY,
      priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY,
      actionLabel: 'Get Started',
    },
    {
      title: 'Pro',
      monthlyPrice: 5,
      yearlyPrice: 50,
      description: 'Perfect for owners of small & medium businessess',
      features: [
        'Example Feature Number 1',
        'Example Feature Number 2',
        'Example Feature Number 3',
      ],
      actionLabel: 'Get Started',
      priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      popular: true,
    },
    {
      title: 'Enterprise',
      price: 'Custom',
      description: 'Dedicated support and infrastructure to fit your needs',
      features: [
        'Example Feature Number 1',
        'Example Feature Number 2',
        'Example Feature Number 3',
        'Super Exclusive Feature',
      ],
      actionLabel: 'Contact Sales',
      priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      exclusive: true,
    },
  ];

  return (
    <div>
      <PricingSwitch onSwitch={togglePricingPeriod} />
      <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
        {plans.map((plan) => {
          return (
            <PricingCard
              user={session?.user}
              handleCheckout={handleCheckout}
              key={plan.title}
              {...plan}
              isYearly={isYearly}
            />
          );
        })}
      </section>
    </div>
  );
}
