"use client"
import React, {useEffect, useState} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {getPriceList} from "@/app/library/services/price_service";
import {env} from "next-runtime-env";
import {createStripeSession} from "@/app/library/services/billing_service";
import {PriceItem} from "@/app/library/objects/Price";

export default function Plan() {
  const [prices, setPrices] = useState<PriceItem[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const resp = await getPriceList();
        setPrices(resp.data);
      } catch (error) {
        console.error('Error fetching price list:', error);
        setPrices([]);  // Set empty array as fallback
      }
    };

    fetchPrices();
  }, []);

  const handleSubscribe = async (priceId: string) => {
    const stripePublicKey = env("NEXT_PUBLIC_STRIPE_PUBLIC_KEY")
    if (!stripePublicKey) {
      console.warn("Stripe public key is missing");
      return;
    }

    const stripe = await loadStripe(stripePublicKey);
    const session = await createStripeSession(priceId)
    await stripe?.redirectToCheckout(session);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {prices.map((plan) => (
            <div key={plan.id} className="border rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              <p className="text-4xl font-bold text-violet-700 mb-6">{plan.price}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600 mt-2">Yes, you can cancel your subscription at any time through your account
                dashboard.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Do you offer free trials?</h3>
              <p className="text-gray-600 mt-2">We offer a 14-day money back guarantee for all new subscriptions.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}