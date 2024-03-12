"use client";
import React from "react";
import { Suspense } from "react";
import Loading from "./loading";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentid = searchParams.get("paymentid");

  return (
    <div className="flex flex-col h-screen items-center justify-center mt-auto mx-auto">
      <div className="bg-gray-100 border border-amber-600 w-auto px-4 py-3 rounded-lg shadow-xl relative" role="alert">
        <div className="flex flex-col items-center p-5">
          <strong className="font-bold text-green-600">Payment successful...!</strong>
          <span className="block sm:inline"> Your paymentID= {paymentid} has been processed. </span>
          <span className="block sm:inline"> Check your email for details. </span>
        </div>
      </div>
      <div className="flex gap-1">
        <Link href="/courses">
          <a className="px-3 py-2 text-white font-bold mt-6 text-center bg-amber-600 hover:bg-amber-500 rounded-sm">Shop Courses</a>
        </Link>
        <Link href="/ebooks">
          <a className="px-3 py-2 text-white font-bold mt-6 text-center bg-gray-700 hover:bg-amber-500 rounded-sm">Shop Ebooks</a>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div><Loading /></div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}
