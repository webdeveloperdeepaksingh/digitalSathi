import React from 'react';
import Image from 'next/image';
import AddItemToCart from '@/components/AddItemToCart/page';
import Footer from '@/components/Footer/page';
import NavBar from '@/components/NavBar/page';
import { BASE_API_URL } from '../../../../utils/constants';


async function getEventById(id){
try 
  {
    const res = await fetch(`${BASE_API_URL}/api/events/${id}`, { cache: 'no-store' });
    if(!res.ok){
      throw new Error("Error fetching event data");
    }
    const eventById = await res.json();
    return eventById;
  } catch (error) {
    console.error("Error fetching eventData: ", error);
  }  
}

export async function generateMetadata({ params, searchParams }, parent) {
try 
  {
    const id = params.EventId
    const res = await fetch(`${BASE_API_URL}/api/events/${id}` , {cache:'no-store'});
    if(!res.ok){
      throw new Error("Error fetching event data");
    }
    const meta = await res.json();
    const previousImages = (await parent).openGraph?.images || []
    return {
      title: meta.result.prodName,
      description: meta.result.prodIntro,
      keywords: [meta.result.prodTags],
      openGraph: {
      images: [meta.result.prodImage, ...previousImages]
    },
  }
  } catch (error) {
    console.error("Error fetching eventData: ", error);
  }
}

export default async function EventLandingPage({params}) {

  if(!BASE_API_URL){
    return null; //must be written to deploy successfully.
  }
  const evt = await getEventById(params.EventId);
 
  return (
    <div>
      <div className='h-[105px]'><NavBar/></div>
      <div className='grid md:grid-cols-2 w-full p-9 gap-1'>
        <div className='relative w-full h-auto'>
            <Image alt={evt.result.prodName} src={evt.result.prodImage} width={700}  height={400}/>
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
      <div className='px-9 '>
        <div className='flex flex-col p-9 border border-solid border-amber-500 rounded-lg'>
          <div className='bg-gray-200 mb-3 rounded-md'>
              <h1 className='p-3 text-3xl font-bold text-center uppercase'>About Event</h1>
          </div>
          <div className='text-left dv-product-detail'>
            <div dangerouslySetInnerHTML={{__html:evt.result.prodDesc}}></div>   
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
