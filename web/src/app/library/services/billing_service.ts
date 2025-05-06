"use server"

import {redirect} from 'next/navigation';
import Stripe from 'stripe';

export async function createStripeSession(priceId: string) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing Stripe secret key');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription', // or 'payment' for one-time payments
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/canceled`,
  });

  if (session.url) {
    redirect(session.url);
  }

  return {sessionId: session.id};
}
