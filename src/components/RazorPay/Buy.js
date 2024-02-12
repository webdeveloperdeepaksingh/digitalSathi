"use client";
import React, { useState } from "react";

const Buy = ({ makePayment }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center ">
      <button
        onClick={() => {
          makePayment({ productId: "example_ebook" });
        }}
        disabled={isLoading}
        className={`bg-amber-600 text-white w-full text-xl text-center font-bold p-3 rounded-md  ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Processing..." : "Fill & Continue"}
      </button>
    </div>
  );
};

export default Buy;
