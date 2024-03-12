"use client";
import React from 'react';
 
export default function Footer() {
  return (
    <div>
       <div className='grid md:grid-cols-4 w-full bg-amber-500 p-5 mt-16'>
            <div className='p-5 text-justify rounded-lg'>
                <p  className='font-bold text-white text-xl'>ABOUT US</p>
                <p className='mt-2 text-sm' >Some centennial enterprises have pages of content that can fit in this section, while startups can fit in this section, while startups.</p>
            </div>
            <div className='flex flex-col p-5 rounded-lg'>
                <p className='font-bold text-white text-xl'>TERMS OF USE</p>
                <a href='/#' className='mt-2 mx-2 text-sm'>Privacy Policy</a>
                <a href='/#' className=' mx-2 text-sm '>Refund Policy</a>
                <a href='/#' className='mx-2 text-sm '>Donate Us</a>
            </div>
            <div className='flex flex-col p-5 rounded-lg'>
                <p className='font-bold text-white text-xl'>SOCIAL MEDIA</p>
                <a href='https://www.facebook.com' className='mt-2 mx-2 text-sm'>Facebook</a>
                <a href='https://www.youtube.com' className=' mx-2 text-sm'>Youtube</a>
                <a href='https://www.instagram.com' className=' mx-2 text-sm '>Instaram</a>
            </div>
            <div className='flex flex-col p-5 rounded-lg'>
                <p className='font-bold text-white text-xl'>CONTACT US</p>
                <p className='mt-2 mx-2 text-md'><span className='font-semibold'>Call Us:</span> 7605487925 </p>
                <p className=' mx-2 text-sm'><span className='font-semibold'>Email Us:</span> info@digitalsathi.com </p>
                <p className=' mx-2 text-sm'><span className='font-semibold'>Address:</span> Noida Extension, Noida - 201301 </p>
            </div>
       </div>
       <div className='bg-white h-6 text-black text-center text-xs p-1 items-center justify-center font-semibold'>
            <p>Copyright © 2024 DigitalSathi Academy. All Right Reserved.</p>
       </div>
    </div>
  )
}
