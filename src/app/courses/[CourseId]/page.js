import React from 'react';
import Image from 'next/image';
import Footer from '@/components/Footer/page';
import { PiVideoBold } from "react-icons/pi";
import NavBar from '@/components/NavBar/page';
import { BASE_API_URL } from '../../../../utils/constants';
import AddItemToCart from '@/components/AddItemToCart/page';

 
async function getCourseById(id){
    const res = await fetch(`${BASE_API_URL}/api/courses/${id}`);
    const courseById = await res.json();
    return courseById;
}

export async function generateMetadata({ params, searchParams }, parent) {
  const id = params.CourseId
  const res = await fetch(`${BASE_API_URL}/api/courses/${id}`);
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
}

export default async function CourseLandingPage({params, searchParams}) {

  if(!BASE_API_URL){
    return null; //must be written to deploy successfully.
  }
  const prod = await getCourseById(params.CourseId);
 
  return (
    <div>
      <div className='h-[105px]'><NavBar/></div>
      <div className='grid md:grid-cols-2 w-full p-9 gap-2 '>
        <Image alt={prod.result.prodName} src={`/images/${prod.result.prodImage}`} width={700} height={400}/>
        <div className='relative h-auto'>
          <h1 className='uppercase p-2 text-2xl font-bold bg-gray-200'>{prod.result.prodName}</h1>
          <p className='text-justify p-2'>{prod.result.prodIntro}</p>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>COURSE VALIDITY</p>
            </div>
            <div>
                <p>{prod.result.prodVal}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>COURSE INSTRUCTOR</p>
            </div>
            <div>
                <p>{prod.result.prodAuth}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Original Price</p>
            </div>
            <div>
                <p>{prod.result.prodPrice}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Discouted Price</p>
            </div>
            <div>
                <p>{prod.result.prodDisc}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Course Category</p>
            </div>
            <div>
                <p>{prod.result.prodCat}</p>
            </div>
          </div>
          <div className='grid grid-cols-1 w-full gap-1 mt-3'>
              <AddItemToCart prodId={prod.result}/>
          </div>
        </div>
      </div>
      <div className='flex flex-col px-9'>
         <div className=''>
             <div dangerouslySetInnerHTML={{__html:prod.result.prodDesc}}></div> 
          </div>
        <div className='bg-gray-200 '>
            <h1 className='p-3 text-3xl font-bold text-center uppercase'>Course Contents</h1>
        </div>
        <div className="w-full  mx-auto">
          {
            prod.result.chapters.map((chapter, index) => 
            (
              <details key={index} className="border-b border-gray-200">
                <summary className="px-4 py-2 hover:bg-gray-100 cursor-pointer uppercase">
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
