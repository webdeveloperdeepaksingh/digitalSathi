'use client';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { BsCashCoin } from "react-icons/bs";
import React from 'react';

export default function Home() {

  const {loggedInUser} = useContext(UserContext);
  
  return (
    <div>
    {
        loggedInUser.result?.usrRole === "STUDENT" ? 
      (
        <div className='relative bg-gray-100 grid grid-cols-1 w-full gap-4 text-center uppercase font-bold shadow-xl p-9'>
          <h1 className='text-6xl text-amber-600'>Welcome</h1>
          <h1 className='text-6xl text-amber-600'>to DigitalSathi</h1>
          <h1 className='text-6xl'>Online Learning Portal</h1>
        </div>
      ): 
        loggedInUser.result?.usrRole === "INSTRUCTOR" ? 
      (
        <div className='relative grid grid-cols-1 md:grid-cols-2  w-full gap-4'>
          <div className='h-[130px] bg-gray-100 shadow-lg rounded-sm p-3'>
              <p className="font-bold text-xl text-black">Revenue:</p>
              <div className="p-3 flex items-center justify-between divide-x gap-3">
                  <span className="text-4xl  text-black"><BsCashCoin/></span>
                  <p className="text-amber-600 px-3">INR: 68,729</p>
              </div>
          </div>
          <div className='h-[130px] bg-amber-600 shadow-lg rounded-sm p-3'>
              <p className="font-bold text-xl text-white">Subscribers:</p>
              <div className="p-3 flex items-center justify-between divide-x gap-3">
                  <span className="text-4xl  text-white"><BsCashCoin/></span>
                  <p className="text-white px-3">INR: 68,729</p>
              </div>
          </div>
        </div>
      ): 
        loggedInUser.result?.usrRole === "ADMIN" ?
      (
        <div className='relative grid grid-cols-1 md:grid-cols-2  w-full gap-4'>
          <div className='h-[130px] bg-gray-100 shadow-lg rounded-sm p-3'>
              <p className="font-bold text-xl text-black">Revenue:</p>
              <div className="p-3 flex items-center justify-between divide-x gap-3">
                  <span className="text-4xl  text-black"><BsCashCoin/></span>
                  <p className="text-amber-600 px-3">INR: 68,729</p>
              </div>
          </div>
          <div className='h-[130px] bg-amber-600 shadow-lg rounded-sm p-3'>
              <p className="font-bold text-xl text-white">Subscribers:</p>
              <div className="p-3 flex items-center justify-between divide-x gap-3">
                  <span className="text-4xl  text-white"><BsCashCoin/></span>
                  <p className="text-white px-3">INR: 68,729</p>
              </div>
          </div>
          <div className='h-[130px] bg-gray-100 md:bg-amber-600 shadow-lg rounded-sm p-3'>
              <p className="font-bold text-xl text-black md:text-white">SignUps:</p>
              <div className="p-3 flex items-center justify-between divide-x gap-3">
                  <span className="text-4xl text-black  md:text-white"><BsCashCoin/></span>
                  <p className="text-amber-600 md:text-white px-3">INR: 68,729</p>
              </div>
          </div>
          <div className='h-[130px] bg-amber-600 md:bg-gray-100 shadow-lg rounded-sm p-3'>
              <p className="font-bold text-xl text-white md:text-black">Enquiries:</p>
              <div className="p-3 flex items-center justify-between divide-x gap-3">
                  <span className="text-4xl  text-white md:text-black"><BsCashCoin/></span>
                  <p className="text-white md:text-amber-600   px-3">INR: 68,729</p>
              </div>
          </div>        
        </div>
      ): null
     }
    </div>
  );
}
