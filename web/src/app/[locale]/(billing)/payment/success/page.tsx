"use server"
import {redirect} from 'next/navigation';
import Stripe from 'stripe';
import {Link} from "@/i18n/routing";
import {JSX} from "react";

type PageProps = Promise<{
  session_id?: string;
}>

export default async function SuccessPage({params}: { params: PageProps }): Promise<JSX.Element> {
  const {session_id} = await params;

  if (!session_id) {
    redirect('/');
  }

  // Verify the session with Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.retrieve(session_id);
  console.log("Session ID:", session.id);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="mb-4">Thank you for your purchase.</p>
      <p className="text-gray-600">
        We&apos;ve sent a receipt to your email address.
      </p>
      <Link
        title="Any Concverters Homepage"
        href="/"
        className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Return to Home
      </Link>
    </div>
  );
}