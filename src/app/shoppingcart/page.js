'use client';
import React from 'react';
import { RxCross2 } from "react-icons/rx";

import NavBar from '@/components/NavBar/page';

export default function ShoppingCart() {
  return (
    <div>
      <div className='h-[90px]'><NavBar/></div>
      <div className='relative w-full md:flex   p-9 gap-9'>
        <div className='relative flex flex-col w-full h-[100px] bg-gray-200 shadow-lg rounded-lg mb-5'>
            <div className='cursor-pointer hover:bg-white bg-gray-100 absolute right-3 top-3 font-bold text-lg'><RxCross2/></div>
            <div>
                {/* course loop */}
            </div>
        </div>
        <div className='relative min-w-[600px] min-h-[400px] p-7 border border-amber-600 rounded-lg'>
            <h3 className='text-center p-4 bg-amber-600 font-bold text-white text-2xl rounded-sm mb-3'>Order Summary</h3>
            <div className='flex border border-solid p-3 mb-3 font-bold'> 
                <div className='w-[10px] mr-8'>Sr.</div>
                <div className='w-[420px] '>Item Description</div>
                <div className='w-[120px]'>Item Price</div>
            </div>
            <div className=''>
                {/* items loop */}
            </div>
            <div className='mb-12  '>
                <div className='border-y-2 py-2'>
                    <p className='font-bold text-lg'>Total:</p>
                    <p className='font-bold text-lg'>Discount:</p>
                </div>
                <div className='py-2'>
                    <p className='font-bold text-lg'>Amount to Pay:</p>
                </div>
            </div>
            <h3 className='text-center p-4 bg-amber-600 font-bold text-white text-2xl rounded-sm mb-3'>Checkout</h3>
        </div>
      </div>
    </div>
  )
}
