import React from 'react';
import Image from 'next/image';
import fetch from 'node-fetch'; 
import Footer from '@/components/Footer/page';
import { PiVideoBold } from "react-icons/pi";
import { BASE_API_URL } from '../../../../utils/constants';
import AddItemToCart from '@/components/AddItemToCart/page';

export async function getCourseById(id) {
try 
  {
    const res = await fetch(`${BASE_API_URL}/api/courses/${id}`, { cache: 'no-store' }); 
    if (!res.ok) {
      throw new Error("Error fetching course data");
    } 
    const courseById = await res.json();
    return courseById;

  } catch (error) {
    console.error("Error fetching course data: ", error);
  }
}


export async function generateMetadata({ params, searchParams }, parent) {
try 
  {
    const id = params.CourseId
    const res = await fetch(`${BASE_API_URL}/api/courses/${id}` , {cache:'no-store'});
    if(!res.ok){
      throw new Error("Error fetching course data");
    }
    const meta = await res.json();
    // optionally access and extend (rather than replace) parent metadata
    // const previousImages = (await parent).openGraph?.images || []
    return {
    title: meta.result.prodName,
    description: meta.result.prodIntro,
    keywords: [meta.result.prodTags],
    // openGraph: {
    //   images: [`/${meta.result.prodImage}`, ...previousImages],
    // },
  }
  } catch (error) {
    console.error("Error fetching course data: ", error);
  }
}

export default async function CourseLandingPage({params}) {

  if(!BASE_API_URL){
    return null; //must be written to deploy successfully.
  }
  const crs = await getCourseById(params.CourseId)
  
  return (
    <div>
      <div className='h-[90px]'></div>
      <div className='grid md:grid-cols-2 w-full p-9 gap-2'>
        <Image alt={crs.result.prodName} src={crs.result.prodImage} width={750} height={400}/>
        <div className='relative h-auto'>
          <h1 className='uppercase p-3 text-2xl font-bold bg-gray-200'>{crs.result.prodName}</h1>
          <p className='text-justify p-2'>{crs.result.prodIntro}</p>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>COURSE VALIDITY</p>
            </div>
            <div>
                <p>{crs.result.prodVal}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>COURSE INSTRUCTOR</p>
            </div>
            <div>
                <p>{crs.result.prodAuth}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Original Price</p>
            </div>
            <div>
                <p>{crs.result.prodPrice}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Discouted Price</p>
            </div>
            <div>
                <p>{crs.result.prodDisc}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Course Category</p>
            </div>
            <div>
                <p>{crs.result.prodCat}</p>
            </div>
          </div>
          <div className='grid grid-cols-1 w-full gap-1 mt-3'>
              <AddItemToCart prodId={crs.result}/>
          </div>
        </div>
      </div>
      <div className='flex flex-col px-9'>
        <div className='flex- flex-col w-full mx-auto h-auto p-9 mb-9 border border-solid border-amber-500 rounded-lg'>
          <div className='bg-gray-200 rounded-md mb-6'>
              <h1 className='p-3 text-3xl font-bold text-center uppercase'>Course Description</h1>
          </div>
          <div className='text-left p-6'>
            <div dangerouslySetInnerHTML={{__html:crs.result.prodDesc}}></div>   
          </div>
        </div>
        <div className="flex flex-col w-full mx-auto h-auto p-9 border border-solid border-amber-500 rounded-lg">
          <div className='bg-gray-200 rounded-md mb-6'>
              <h1 className='p-3 text-3xl font-bold text-center uppercase'>Course Contents</h1>
          </div>
          {
            crs.result.chapters.map((chapter, index) => 
            (
              <details key={index} className="border-b border-gray-200">
                <summary className="font-semibold px-4 py-2 hover:bg-gray-100 cursor-pointer uppercase">
                  {chapter.chapName}
                </summary>
                <div className="bg-white">
                  {chapter.topics.map((topic, i) => (
                    <p key={i} className="px-9 py-2 border-t flex items-center">
                      <PiVideoBold className='mr-3' />{topic.topName}
                    </p>
                  ))}
                </div>
              </details>
            ))
          }
        </div>
      </div>
      <Footer/>
    </div>
  )
}
