import React from 'react';
import Image from 'next/image';
import Footer from '@/components/Footer/page';
import NavBar from '@/components/NavBar/page';
import { BASE_API_URL } from '../../../../utils/constants';

async function getBlog(id){
try 
  {
    const res = await fetch(`${BASE_API_URL}/api/blogs/${id}`);
    const blogById = await res.json();
    return blogById;
  } catch (error) {
    console.error("Error fetching blgData: ", error);
  } 
}

export async function generateMetadata({ params, searchParams }, parent) {
  const id = params.BlogId
  const res = await fetch(`${BASE_API_URL}/api/blogs/${id}`);
  const meta = await res.json();
  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []
  return {
    title: meta.result.blgName,
    description: meta.result.blgIntro,
    keywords: [meta.result.blgTags],
    // openGraph: {
    //   images: [`/${meta.result.prodImage}`, ...previousImages],
    // },
  }
}

export default async function BlogLandingPage({params}) {

  if(!BASE_API_URL){
    return null; //must be written to deploy successfully.
  }
    const blg = await getBlog(params.BlogId);

  return (
    <div>
      <div className='h-[105px]'><NavBar/></div>
      <div className='flex flex-col w-full p-9'>
        <div className='relative w-full h-auto'>
          <Image alt={blg.result.blgName} src={`/images/${blg.result.blgImage}`} width={1500} height={400}/>
        </div>
        <div className='my-3'>
          <h1 className='text-center font-bold uppercase text-3xl mb-9'>{blg.result.blgName}</h1>
          <div className='text-justify'>
              <p>{blg.result.blgDesc}</p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
