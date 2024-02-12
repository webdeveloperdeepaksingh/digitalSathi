import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/NavBar/page';

async function getEventById(id){
    const res = await fetch(`http://localhost:3000/api/events/${id}`);
    const eventById = await res.json();
    return eventById;
}

export async function generateMetadata({ params, searchParams }, parent) {
  const id = params.EventId
  const res = await fetch(`http://localhost:3000/api/events/${id}`);
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

export default async function EventLandingPage({params}) {

  const evt = await getEventById(params.EventId);
  console.log(evt);

  return (
    <div>
      <div className='h-[90px]'><NavBar/></div>
      <div className='grid md:grid-cols-2 w-full p-9 gap-2 '>
        <div className='relative w-full h-[400px]'>
            <Image alt={evt.result.prodName} src={`/images/${evt.result.prodImage}`} objectFit='cover' fill/>
        </div>
        <div className='relative'  >
          <h1 className='uppercase p-2 text-2xl font-bold bg-gray-200'>{evt.result.prodName}</h1>
          <p className='text-justify p-2'>{evt.result.prodIntro}</p>
          <div className='flex flex-col w-full p-3'>
            <div className='flex'>
              <p className='font-bold mr-[120px]'>Event Date</p>
              <p className='font-bold mr-10'>:</p>
              <p >{evt.result.prodDate}</p>
            </div>
            <div className='flex'>
              <p className='font-bold mr-[118px]'>Event Time</p>
              <p className='font-bold mr-10'>:</p>
              <p>{evt.result.prodTime}</p>
            </div>
            <div className='flex'>
              <p className='font-bold mr-[114px]'>Event Mode</p>
              <p className='font-bold mr-10'>:</p>
              <p>{evt.result.prodMod}</p>
            </div>
            <div className='flex'>
              <p className='font-bold mr-[119px]'>Event Price</p>
              <p className='font-bold mr-10'>:</p>
              <p>{evt.result.prodPrice}</p>
            </div>
            <div className='flex'>
              <p className='font-bold mr-[135px]'>Category</p>
              <p className='font-bold mr-10'>:</p>
              <p>{evt.result.prodCat}</p>
            </div>
          </div>
          <div className=' absolute grid grid-cols-1 w-full gap-1 bottom-0'>
            <Link href={`/events/${params.EventId}/register`} className='py-2 rounded-sm px-1 bg-amber-600 hover:bg-amber-500 text-white text-center text-2xl'>Register for the event</Link>
          </div>
        </div>
      </div>
      <div className='px-9'>
        <div className='bg-gray-200 '>
            <h1 className='p-3 text-3xl font-bold text-center uppercase'>About Event</h1>
        </div>
        <div className='text-justify'>
            <p>{evt.result.prodDesc}</p>
        </div>
      </div>
    </div>
  )
}
