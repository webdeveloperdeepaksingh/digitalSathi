import React from 'react';
import Image from 'next/image';
import AddItemToCart from '@/components/AddItemToCart/page';
import Footer from '@/components/Footer/page';
import NavBar from '@/components/NavBar/page';
import { BASE_API_URL } from '../../../../utils/constants';


async function getEventById(id){
    const res = await fetch(`${BASE_API_URL}/api/events/${id}`);
    const eventById = await res.json();
    return eventById;
}

export async function generateMetadata({ params, searchParams }, parent) {
  const id = params.EventId
  const res = await fetch(`${BASE_API_URL}/api/events/${id}`);
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
      <div className='h-[105px]'><NavBar/></div>
      <div className='grid md:grid-cols-2 w-full p-9 gap-1'>
        <div className='relative w-full h-auto'>
            <Image alt={evt.result.prodName} src={`/images/${evt.result.prodImage}`} width={700}  height={400}/>
        </div>
        <div className='relative h-auto'  >
          <h1 className='uppercase p-2 text-2xl font-bold bg-gray-200'>{evt.result.prodName}</h1>
          <p className='text-justify p-2'>{evt.result.prodIntro}</p>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Date of event</p>
            </div>
            <div>
                <p>{evt.result.prodDate}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Time of event</p>
            </div>
            <div>
                <p>{evt.result.prodTime}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Original Price</p>
            </div>
            <div>
                <p>{evt.result.prodPrice}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Discounted Price</p>
            </div>
            <div>
                <p>{evt.result.prodDisc}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Category</p>
            </div>
            <div>
                <p>{evt.result.prodCat}</p>
            </div>
          </div>
          <div className='grid grid-cols-1 w-full gap-1 mt-3'>
             <AddItemToCart prodId={evt.result}/>
          </div>
        </div>
      </div>
      <div className='px-9'>
        <div className='bg-gray-200 '>
            <h1 className='p-3 text-3xl font-bold text-center uppercase'>About Event</h1>
        </div>
        <div className='text-justify p-6'>
          <div dangerouslySetInnerHTML={{__html:evt.result.prodDesc}}></div>   
        </div>
      </div>
      <Footer/>
    </div>
  )
}
