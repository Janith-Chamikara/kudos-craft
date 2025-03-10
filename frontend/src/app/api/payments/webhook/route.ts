import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );
  const reqText = await req.text();

  return webhooksHandler(reqText, req, supabase);
}

async function getCustomerEmail(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    console.log(customer);
    return (customer as Stripe.Customer).email;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

async function handleSubscriptionEvent(
  event: Stripe.Event,
  type: 'created' | 'updated' | 'deleted',
  supabase: ReturnType<typeof createServerClient>,
) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerEmail = await getCustomerEmail(subscription.customer as string);
  console.log('CUSTOMER EMAIL', customerEmail);
  console.log('SUBSCRIPTION', subscription);
  if (!customerEmail) {
    return NextResponse.json({
      status: 500,
      error: 'Customer email could not be fetched',
    });
  }

  // First get the user
  const { data: user, error: userError } = await supabase
    .from('User')
    .select('id')
    .eq('email', customerEmail)
    .single();
  console.log('USER', user, userError);
  if (userError || !user) {
    return NextResponse.json({
      status: 404,
      error: 'User not found',
    });
  }
  const subscriptionId = crypto.randomUUID();
  const now = new Date().toISOString();
  const subscriptionData = {
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    planId: 'planId',
    startDate: new Date(subscription.created * 1000).toISOString(),
    endDate: subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000).toISOString()
      : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    userId: user.id,
    id: subscriptionId,
    createdAt: now,
    updatedAt: now,
  };

  console.log('SUBSCRIPTION DATA', subscriptionData);
  console.log('Type', type);
  if (type === 'deleted') {
    // Update subscription status
    const { error: subError } = await supabase
      .from('Subscription')
      .update({
        status: 'canceled',
        endDate: new Date().toISOString(),
        cancelAtPeriodEnd: true,
      })
      .eq('stripeSubscriptionId', subscription.id);

    // Update user subscription status
    const { error: userUpdateError } = await supabase
      .from('User')
      .update({
        subscriptionPlan: 'free',
        subscriptionStatus: null,
        subscriptionId: null,
        currentPeriodEnd: null,
      })
      .eq('id', user.id);

    if (subError || userUpdateError) {
      console.error(
        'Error updating subscription:',
        subError || userUpdateError,
      );
      return NextResponse.json({
        status: 500,
        error: 'Error updating subscription status',
      });
    }
  } else if (type === 'created') {
    // Insert new subscription
    const { error: subError } = await supabase
      .from('Subscription')
      .insert([subscriptionData]);

    // Update user subscription status
    const { error: userUpdateError } = await supabase
      .from('User')
      .update({
        subscriptionPlan: 'premium', // Adjust based on your plan names
        subscriptionStatus: subscription.status,
        subscriptionId: subscription.id,
        currentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ).toISOString(),
        stripeCustomerId: subscription.customer as string,
      })
      .eq('id', user.id);
    console.log('USER UPDATE ERROR', userUpdateError);
    console.log('SUB ERROR', subError);
    if (subError || userUpdateError) {
      console.error(
        'Error creating subscription:',
        subError || userUpdateError,
      );
      return NextResponse.json({
        status: 500,
        error: 'Error creating subscription',
      });
    }
  } else {
    // Update existing subscription
    const { error: subError } = await supabase
      .from('Subscription')
      .update(subscriptionData)
      .eq('stripeSubscriptionId', subscription.id);

    // Update user subscription status
    const { error: userUpdateError } = await supabase
      .from('User')
      .update({
        subscriptionStatus: subscription.status,
        currentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ).toISOString(),
      })
      .eq('id', user.id);

    if (subError || userUpdateError) {
      console.error(
        'Error updating subscription:',
        subError || userUpdateError,
      );
      return NextResponse.json({
        status: 500,
        error: 'Error updating subscription',
      });
    }
  }

  return NextResponse.json({
    status: 200,
    message: `Subscription ${type} success`,
  });
}

async function handleInvoiceEvent(
  event: Stripe.Event,
  status: 'succeeded' | 'failed',
  supabase: ReturnType<typeof createServerClient>,
) {
  const invoice = event.data.object as Stripe.Invoice;
  const customerEmail = await getCustomerEmail(invoice.customer as string);

  if (!customerEmail) {
    return NextResponse.json({
      status: 500,
      error: 'Customer email could not be fetched',
    });
  }

  // Get the user
  const { data: user, error: userError } = await supabase
    .from('User')
    .select('id')
    .eq('email', customerEmail)
    .single();

  if (userError || !user) {
    return NextResponse.json({
      status: 404,
      error: 'User not found',
    });
  }

  const { data: subscription } = await supabase
    .from('Subscription')
    .select('id')
    .eq('stripeSubscriptionId', invoice.subscription)
    .single();
  const invoiceId = crypto.randomUUID();
  const now = new Date().toISOString();
  const invoiceData = {
    stripeInvoiceId: invoice.id,
    amount:
      (status === 'succeeded' ? invoice.amount_paid : invoice.amount_due) / 100,
    currency: invoice.currency,
    status: status === 'succeeded' ? 'paid' : 'unpaid',
    invoiceDate: new Date(invoice.created * 1000).toISOString(),
    paidAt: status === 'succeeded' ? new Date().toISOString() : null,
    userId: user.id,
    subscriptionId: subscription?.id,
    id: invoiceId,
    createdAt: now,
    updatedAt: now,
  };

  const { error } = await supabase.from('Invoice').insert([invoiceData]);

  if (error) {
    console.error(`Error inserting invoice (${status}):`, error);
    return NextResponse.json({
      status: 500,
      error: `Error inserting invoice (${status})`,
    });
  }

  return NextResponse.json({
    status: 200,
    message: `Invoice ${status} processed successfully`,
  });
}

async function handleCheckoutSessionCompleted(
  event: Stripe.Event,
  supabase: ReturnType<typeof createServerClient>,
) {
  const session = event.data.object as Stripe.Checkout.Session;
  const metadata: any = session?.metadata;

  if (!session.customer) {
    return NextResponse.json({
      status: 400,
      error: 'No customer associated with session',
    });
  }

  const customerEmail = await getCustomerEmail(session.customer as string);
  if (!customerEmail) {
    return NextResponse.json({
      status: 500,
      error: 'Customer email could not be fetched',
    });
  }

  const { data: user, error: userError } = await supabase
    .from('User')
    .select('id')
    .eq('email', customerEmail)
    .single();

  if (userError || !user) {
    return NextResponse.json({
      status: 404,
      error: 'User not found',
    });
  }

  if (metadata?.subscription === 'true') {
    // Handle subscription checkout
    const subscriptionId = session.subscription;
    if (subscriptionId) {
      await stripe.subscriptions.update(subscriptionId as string, {
        metadata: { userId: user.id },
      });

      const { error: updateError } = await supabase
        .from('User')
        .update({
          stripeCustomerId: session.customer as string,
          subscriptionStatus: 'active',
          subscriptionPlan: 'premium', // Adjust based on your plan names
        })
        .eq('id', user.id);

      if (updateError) {
        throw new Error('Error updating user subscription status');
      }
    }
  } else {
    // Handle one-time payment
    const { error: invoiceError } = await supabase.from('Invoice').insert([
      {
        stripeInvoiceId: session.id,
        amount: (session.amount_total || 0) / 100,
        currency: session.currency || 'usd',
        status: 'paid',
        invoiceDate: new Date(session.created * 1000).toISOString(),
        paidAt: new Date().toISOString(),
        userId: user.id,
      },
    ]);

    if (invoiceError) {
      throw new Error('Error inserting invoice');
    }
  }

  return NextResponse.json({
    status: 200,
    message: 'Checkout session processed successfully',
  });
}

async function webhooksHandler(
  reqText: string,
  request: NextRequest,
  supabase: ReturnType<typeof createServerClient>,
): Promise<NextResponse> {
  const sig = request.headers.get('Stripe-Signature');

  try {
    const event = await stripe.webhooks.constructEventAsync(
      reqText,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    console.log(event.type);
    switch (event.type) {
      case 'customer.subscription.created':
        return handleSubscriptionEvent(event, 'created', supabase);
      case 'customer.subscription.updated':
        return handleSubscriptionEvent(event, 'updated', supabase);
      case 'customer.subscription.deleted':
        return handleSubscriptionEvent(event, 'deleted', supabase);
      case 'invoice.payment_succeeded':
        return handleInvoiceEvent(event, 'succeeded', supabase);
      case 'invoice.payment_failed':
        return handleInvoiceEvent(event, 'failed', supabase);
      case 'checkout.session.completed':
        return handleCheckoutSessionCompleted(event, supabase);
      default:
        return NextResponse.json({
          status: 400,
          error: 'Unhandled event type',
        });
    }
  } catch (err) {
    console.error('Error constructing Stripe event:', err);
    return NextResponse.json({
      status: 500,
      error: 'Webhook Error: Invalid Signature',
    });
  }
}
