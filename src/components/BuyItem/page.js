"use client";
import React, { useState } from 'react';
import CustomerDetails from '../CustomerDetails/page';


export default function BuyItem({prodId}) {

  const [showCustomerDetailsForm, setShowCustomerDetailsForm] = useState(false);
  const [transDetails, setTransDetails] = useState("");

  const handleCustomerDetails = (prod) =>{
    setShowCustomerDetailsForm(true);
    setTransDetails(prod);
 }

  return (
    <div>
      <div className={showCustomerDetailsForm == true ? 'absolute inset-0 flex items-center justify-center z-100 mx-auto' : 'hidden'}>
        <CustomerDetails transDetails={transDetails} setShowCustomerDetailsForm={setShowCustomerDetailsForm} />
      </div>
      <button onClick={()=>handleCustomerDetails(prodId)} className='w-full font-bold py-2 rounded-sm px-1 bg-gray-700 hover:bg-gray-600 text-white'>Buy Now</button>
    </div>
  )
}
