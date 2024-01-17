'use client'
import { BsCashCoin } from "react-icons/bs";

import React from 'react';

export default function Home() {
  return (
    <div>
      <div className='relative grid grid-cols-2 md:grid-cols-4 w-full gap-4'>
        <div className='h-[130px] bg-blue-600 shadow-lg rounded-sm p-3'>
            <p className="font-bold text-xl text-white">Revenue:</p>
            <div className="p-3 flex items-center justify-between divide-x gap-3">
                <span className="text-4xl  text-white"><BsCashCoin/></span>
                <p className="text-white px-3">INR: 68,729</p>
            </div>
        </div>
        <div className='h-[130px] bg-yellow-600 shadow-lg rounded-sm p-3'>
            <p className="font-bold text-xl text-white">Sign Ups:</p>
            <div className="p-3 flex items-center justify-between divide-x gap-3">
                <span className="text-4xl  text-white"><BsCashCoin/></span>
                <p className="text-white px-3">No.: 729</p>
            </div>
        </div>
        <div className='h-[130px] bg-pink-600 shadow-lg rounded-sm p-3'>
            <p className="font-bold text-xl text-white">Subscribers:</p>
            <div className="p-3 flex items-center justify-between divide-x gap-3">
                <span className="text-4xl  text-white"><BsCashCoin/></span>
                <p className="text-white px-3">INR: 68,729</p>
            </div>
        </div>
        <div className='h-[130px] bg-gray-600 shadow-lg rounded-sm p-3'>
            <p className="font-bold text-xl text-white">Enquiry:</p>
            <div className="p-3 flex items-center justify-between divide-x gap-3">
                <span className="text-4xl  text-white"><BsCashCoin/></span>
                <p className="text-white px-3">INR: 68,729</p>
            </div>
        </div>
      </div>
    </div>
  )
}
