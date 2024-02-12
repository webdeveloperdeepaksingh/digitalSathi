'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import BuyProduct from '../RazorPay/BuyProduct';

export default function CustomerDetails({ setShowCustomerDetailsForm }) {

  const router = useRouter();
  const handleClose = () =>{
    setShowCustomerDetailsForm(false);
  }

  return (
    <div>
      <div className= 'relative bg-gray-100 p-4 w-[400px] border-2 border-amber-600 rounded-md shadow-xl'> 
          <button type='button' onClick={handleClose} className='absolute right-4 text-amber-600'>X</button>    
          <BuyProduct/>
      </div>
    </div>
  )
}
