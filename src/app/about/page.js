"use client";
import Footer from '@/components/Footer/page';
import Image from 'next/image';
import InnerBanner from '../../../public/images/inrbnr.jpg';
import React from 'react';

export default function AboutUs() {
  return (
    <div>
      <div className='h-[88px]'></div>
      <div className='w-auto h-auto'>
        <Image alt='innerBanner' src={InnerBanner} width={1540} height={400}></Image>
      </div>
      <title>DigitalSathi | About Us</title>
        <Footer/>
    </div>
  )
}
