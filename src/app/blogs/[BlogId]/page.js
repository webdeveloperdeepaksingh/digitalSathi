import React from 'react';
import Image from 'next/image';
import Footer from '@/components/Footer/page';
import NavBar from '@/components/NavBar/page';
import { BASE_API_URL } from '../../../../utils/constants';

async function getBlog(id){
try 
  {
    const res = await fetch(`${BASE_API_URL}/api/blogs/${id}`, { cache: 'no-store' });
    if(!res.ok){
      throw new Error("Error fetching blog data.");
    }
    const blogById = await res.json();
    return blogById;
  } catch (error) {
    console.error("Error fetching blgData: ", error);
  } 
}

export async function generateMetadata({ params, searchParams }, parent) {
try 
  {
    const id = params.BlogId
    const res = await fetch(`${BASE_API_URL}/api/blogs/${id}`, {cache:'no-store'});
    if(!res.ok){
      throw new Error("Error fetching blog data.");
    }
    const meta = await res.json();
    const previousImages = (await parent).openGraph?.images || []
    return {
    title: meta.result.blgName,
    description: meta.result.blgIntro,
    keywords: [meta.result.blgTags],
    openGraph: {
      images: [meta.result.blgImage, ...previousImages],
    },
  }
  } catch (error) {
    console.error("Error fetching blgData: ", error);
  }
}

export default async function BlogLandingPage({params}) {

  if(!BASE_API_URL){
    return null; //must be written to deploy successfully.
  }
    const blg = await getBlog(params.BlogId);

  return (
    <div>
      <div className='h-[86px]'><NavBar/></div>
      <div className='relative w-full h-auto'>
          <Image alt={blg.result.blgName} src={blg.result.blgImage} width={1520} height={400}/>
      </div>
      <div className='flex flex-col w-full p-9'>
        <div className='flex flex-col'>
          <h1 className='text-center font-bold bg-gray-200 py-3 uppercase rounded-md text-3xl mb-6'>{blg.result.blgName}</h1>
          <div className='text-justify'>         
            <div dangerouslySetInnerHTML={{__html:blg.result.blgDesc}}></div>             
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
