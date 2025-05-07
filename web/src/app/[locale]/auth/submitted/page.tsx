"use client"
import {useRouter} from "@/i18n/routing";
import {useSearchParams} from "next/navigation";

export default function Register() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email")
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-lg shadow-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Registration Successful</h2>
        <div className="text-white text-center mt-6">
          <p className="mb-4">Thank you for registering!</p>
          <p className="mb-4">We have sent a confirmation email to <span className="font-bold">{email}</span></p>
          <p className="mb-4">Please check your email and click on the confirmation link to activate your account.</p>
          <button
            onClick={() => router.replace("/login")}
            className="mt-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}