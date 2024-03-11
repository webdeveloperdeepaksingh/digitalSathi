"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar/page";

const Success = () => {
  const searchParams = useSearchParams();
  const paymentid = searchParams.get("paymentid");

  return (
    <>
    {/* <NavBar className='h-[105px]'/> */}
    <div className="flex flex-col h-screen items-center justify-center mt-auto mx-auto">
      <div className="bg-gray-100 border border-amber-600 w-auto px-4 py-3 rounded-lg shadow-xl relative" role="alert">
        <div className="flex flex-col items-center p-5">
          <strong className="font-bold text-green-600">Payment successful...!</strong>
          <span className="block sm:inline"> Your paymentID= {paymentid} has been processed. </span>
          <span className="block sm:inline"> Check your email for details. </span>
        </div>
      </div>
      <div className="flex gap-1">
        <Link href='/courses' className="px-3 py-2 text-white font-bold mt-6 text-center bg-amber-600 hover:bg-amber-500 rounded-sm">Shop Courses</Link>
        <Link href='/ebooks' className="px-3 py-2 text-white font-bold mt-6 text-center bg-gray-700 hover:bg-amber-500 rounded-sm">Shop Ebooks</Link>
      </div>
    </div>
    </>
  );
};

export default Success;
