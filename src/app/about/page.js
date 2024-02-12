import Footer from '@/components/Footer/page';
import NavBar from '@/components/NavBar/page';
import Image from 'next/image';
import InnerBanner from '../../../public/images/inrbnr.jpg';
import React from 'react';

export const metadata = {
  title: "DigitalSathi: About Us",
  description: "About Us"
}

export default function AboutUs() {
  return (
    <div>
      <div className='h-[90px]'>
        <NavBar/>
      </div>
      <div className='w-full h-auto'>
        <Image alt='innerBanner' src={InnerBanner} width={1540} height={400}></Image>
      </div>
        <Footer/>
    </div>
  )
}
