import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/NavBar/page';

async function getBlog(id){
    const res = await fetch(`http://localhost:3000/api/blogs/${id}`);
    const blogById = await res.json();
    return blogById;
}

export default async function BlogLandingPage({params}) {

    const blg = await getBlog(params.BlogId);

  return (
    <div>
      <div className='h-[90px]'><NavBar/></div>
      <div className='relative w-full h-[300px]'>
        <Image alt={blg.result.blgName} src={`/images/${blg.result.blgImage}`} fill objectFit='cover' />
      </div>
      <div className='p-9'>
          <h1 className='text-center font-bold uppercase text-3xl mb-9'>{blg.result.blgName}</h1>
          <div className='text-justify'>
              <p>{blg.result.blgDesc}</p>
          </div>
      </div>
    </div>
  )
}
