import {Link} from "@/i18n/routing";

export default function CanceledPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Canceled</h1>
      <p className="mb-4">Your payment was canceled.</p>
      <p className="text-gray-600">
        No charges were made to your account.
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
