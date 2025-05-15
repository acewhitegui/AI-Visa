"use server"

import {redirect} from 'next/navigation';
import Stripe from 'stripe';

export async function createStripeSession(userId: number, conversationId: string, isRegeneration: boolean, priceId: string, successUrl?: string, cancelUrl?: string): Promise<string> {
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
    payment_intent_data: {
      metadata: {
        "user_id": userId,
        "conversation_id": conversationId
      }
    },
    mode: 'payment', // or 'payment' for one-time payments
    success_url: successUrl ? `${process.env.NEXT_PUBLIC_BASE_URL}${successUrl}?session_id={CHECKOUT_SESSION_ID}&&conversation_id=${conversationId}&&is_regeneration=${isRegeneration}` : `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl ? `${process.env.NEXT_PUBLIC_BASE_URL}${cancelUrl}` : `${process.env.NEXT_PUBLIC_BASE_URL}/payment/canceled`,
  });

  if (session.url) {
    redirect(session.url);
  }

  return session.id;
}
