import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoIosArrowDown } from "react-icons/io";
import NavBar from '@/components/NavBar/page';

async function getEbookById(id){
    const res = await fetch(`http://localhost:3000/api/ebooks/${id}`);
    const ebookById = await res.json();
    return ebookById;
}

export async function generateMetadata({ params, searchParams }, parent) {
  const id = params.EbookId
  const res = await fetch(`http://localhost:3000/api/ebooks/${id}`);
  const meta = await res.json();
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
  return {
    title: meta.result.prodName,
    description: meta.result.prodIntro,
    keywords: [meta.result.prodTags],
    openGraph: {
      images: [`/${meta.result.prodImage}`, ...previousImages],
    },
  }
}

export default async function EbooksLandingPage({params}) {

  const ebk = await getEbookById(params.EbookId);

  return (
    <div>
      <div className='h-[90px]'><NavBar/></div>
      <div className='grid md:grid-cols-2 w-full p-9 gap-2 '>
        <div className='relative w-full h-[400px]'>
            <Image alt={ebk.result.prodName} src={`/images/${ebk.result.prodImage}`} objectFit='cover' fill/>
        </div>
        <div className='relative'  >
          <h1 className='uppercase p-2 text-2xl font-bold bg-gray-200'>{ebk.result.prodName}</h1>
          <p className='text-justify p-2'>{ebk.result.prodIntro}</p>
          <div className='grid grid-cols-2 w-full gap-2'>
            <div className='font-bold px-2'>
                <p className='mb-3'>Ebook Author:</p>
                <p className='mb-3'>Original Price:</p>
                <p className='mb-3'>Discounted Price:</p>
                <p className='mb-3'>Ebook Category:</p>
            </div>
            <div className=' px-2'>
                <p className='mb-3'>{ebk.result.prodAuth}</p>
                <p className='mb-3'>{ebk.result.prodPrice}</p>
                <p className='mb-3'>{ebk.result.prodDisc}</p>
                <p className='mb-3'>{ebk.result.prodCat}</p>
            </div>
          </div>
          <div className=' absolute grid grid-cols-2 w-full gap-1 bottom-0'>
            <button className='font-bold py-2 rounded-sm px-1 bg-amber-600 hover:bg-amber-500 text-white'>Add to Cart</button>
            <button className='font-bold py-2 rounded-sm px-1 bg-gray-400 hover:bg-gray-300'>Buy Now</button>
          </div>
        </div>
      </div>
      <div className='px-9'>
        <div className='bg-gray-200 '>
            <h1 className='p-3 text-3xl font-bold text-center uppercase'>Ebook Contents</h1>
        </div>
        <div>
        
        </div>
      </div>
    </div>
  )
}
