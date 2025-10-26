"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Suspense } from "react";

// Ensure this page is not prerendered (opt-out) so client hooks won't break build
export const dynamic = "force-dynamic";

const TransactionCancelled = () => {
  const router = useRouter();

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      router.push("/dashboard/overview");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      }
    >
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h3 className="heading-3">Transaction Failed!</h3>
        <FaInfoCircle size={100} className="text-red-500" />
        <p className="">Please try again later or contact support.</p>
        <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded">
          Go to Home
        </Link>
        <p className="text-gray-500">Redirecting in {countdown} seconds...</p>
      </div>
    </Suspense>
  );
};
export default TransactionCancelled;