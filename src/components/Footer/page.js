import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <div>
       <div className='grid md:grid-cols-4 w-full bg-amber-600 p-5'>
            <div className='p-5 text-justify rounded-lg'>
                <p  className='font-bold p-2 bg-amber-500 text-xl'>ABOUT US</p>
                <p className='py-3 px-2 text-white text-md' >Some centennial enterprises have pages of content that can fit in this section, while startups can fit in this section, while startups.</p>
            </div>
            <div className='p-5 rounded-lg'>
                <p className='font-bold p-2 bg-amber-500 text-xl'>QUICK LINKS</p>
                <p className='pt-3 px-2  text-md text-white'><Link href='/#'>Online Events</Link></p>
                <p className='pt-1 px-2 text-md text-white'><Link href='/#'>Make Donation</Link></p>
                <p className='pt-1 px-2 text-md text-white'><Link href='/#'>Read Blogs</Link></p>
            </div>
            <div className='p-5 rounded-lg'>
                <p className='font-bold p-2 bg-amber-500 text-xl'>SOCIAL MEDIA</p>
                <p className='pt-3 px-2  text-md text-white'><Link href='/#'>Facebook</Link></p>
                <p className='pt-1 px-2 text-md text-white'><Link href='/#'>Youtube</Link></p>
                <p className='pt-1 px-2 text-md text-white'><Link href='/#'>Instaram</Link></p>
            </div>
            <div className='p-5 rounded-lg'>
                <p className='font-bold p-2 bg-amber-500 text-xl'>CONTACT US</p>
                <p className='pt-3 px-2  text-md text-white'>Call Us: 7605487925 / 6978547895</p>
                <p className='pt-1 px-2  text-md text-white'>Email Us: info@digitalsathi.com / support@digitalsathi.com</p>
                <p className='pt-1 px-2  text-md text-white'>Noida Extension, Noida - 201301 </p>
            </div>
       </div>
    </div>
  )
}
