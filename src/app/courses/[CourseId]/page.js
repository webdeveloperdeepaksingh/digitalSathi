import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PiVideoBold } from "react-icons/pi";
import NavBar from '@/components/NavBar/page';

async function getCourseById(id){
    const res = await fetch(`http://localhost:3000/api/courses/${id}`);
    const courseById = await res.json();
    return courseById;
}

export default async function CourseLandingPage({params}) {

  const cors = await getCourseById(params.CourseId);
  console.log(cors);

  return (
    <div>
      <div className='h-[90px]'><NavBar/></div>
      <div className='grid md:grid-cols-2 w-full p-9 gap-2 '>
        <div className='relative w-full h-[400px]'>
            <Image alt={cors.result.coName} src={`/images/${cors.result.coImage}`} objectFit='cover' fill/>
        </div>
        <div className='relative'  >
          <h1 className='uppercase p-2 text-2xl font-bold bg-gray-200'>{cors.result.coName}</h1>
          <p className='text-justify p-2'>{cors.result.coIntro}</p>
          <div className='grid grid-cols-2 w-full gap-2'>
            <div className='font-bold px-2'>
                <p className='mb-3'>Course Validity:</p>
                <p className='mb-3'>Course Instructor:</p>
                <p className='mb-3'>Original Price:</p>
                <p className='mb-3'>Discounted Price:</p>
                <p className='mb-3'>Course Category:</p>
            </div>
            <div className=' px-2'>
                <p className='mb-3'>{cors.result.coVal}</p>
                <p className='mb-3'>Deepak Singh</p>
                <p className='mb-3'>{cors.result.coPrice}</p>
                <p className='mb-3'>{cors.result.coDisc}</p>
                <p className='mb-3'>{cors.result.coCat}</p>
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
            <h1 className='p-3 text-3xl font-bold text-center uppercase'>Course Contents</h1>
        </div>
        <div className="w-full  mx-auto">
          {
            cors.result.chapters.map((chapter, index) => 
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
      <div className='px-9'>
        <div className='bg-gray-200 my-5'>
            <h1 className='p-3 text-3xl font-bold text-center uppercase'>COURSE INSTRUCTOR</h1>
        </div>
        <div className='grid md:grid-cols-2'>
            <div className=' bg-gray-100 rounded-lg h-[400px]'>
                <Image alt='' src='/#'  width={600} height={400}/>
            </div>
            <div>

            </div>
        </div>
      </div>
    </div>
  )
}
