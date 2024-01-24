'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RiVideoFill } from "react-icons/ri";
import { IoIosArrowDown } from 'react-icons/io';

export default function WatchCourse({params}) {

    const [top, setTop] = useState('');
    const [chap, setChap] = useState([]);
    const [toggle, setToggle] = useState(false);

    const handleWatch=(chapId, topId)=>{
        async function fetchTop(){
            const response = await fetch(`http://localhost:3000/api/courses/${params.CourseId}/chapter/${chapId}/topic/${topId}`);
            const topData = await response.json();
            setTop(topData.result);  
          }
          fetchTop();
       }

  useEffect(() =>{  
    async function fetchChap() {
        try {
          const response = await fetch(`http://localhost:3000/api/courses/${params.CourseId}/chapter`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const chapters = await response.json();
          setChap(chapters.result);      
          handleWatch(chapters.result[0]?._id, chapters.result[0]?.topics[0]?._id);             
         } catch (error) {
          console.error('Error:', error);
        }
      }
    fetchChap();    
   });

 const handleToggle = (index) => { 
    if(toggle === index){
        setToggle(null); 
    } else {
        setToggle(index);
    }
}

  return (
    <div>
      <div className='relative flex flex-col w-full p-9 shadow-lg rounded-lg'>
    <div>
        <div className='w-full gap-4 grid md:grid-cols-2'>
            <div className='flex flex-col border border-solid p-5 rounded-lg'>
                <h3 className='bg-gray-600 text-xl text-white text-center p-5'>TOPIC: {top.topName} </h3>
                <div className='flex w-full justify-center'>
                    <div className='w-full md:h-[350px] h-[250px] border border-solid'>
                        <iframe className="w-full aspect-video h-full" src={top.videoUrl}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        >
                        </iframe>
                    </div>
                </div>           
            </div>
            <div className='flex flex-col overflow-auto border border-solid pb-4 pt-6  rounded-lg'>
                {
                    chap?.map((ch, index) => {
                    return (
                        <>
                        <div key={index}  onClick={() => handleToggle(index)} className={toggle === index ? ' relative bg-gray-200 flex items-center mb-1 text-lg hover:bg-gray-100 rounded-sm border border-solid mx-5 font-bold cursor-pointer' : 'relative flex bg-gray-200 items-center mb-1 text-lg hover:bg-gray-100 rounded-sm border border-solid mx-5 font-bold cursor-pointer'}>
                            <h1 className='uppercase p-2'>{ch.chapName}</h1>
                            <div className='flex items-center p-0'>
                                <span className={toggle === index ? 'absolute rotate-180 duration-500 top-3 right-3 text-2xl text-amber-600' : 'absolute duration-500 top-3 right-3 text-2xl text-amber-600'}><IoIosArrowDown/></span>
                            </div> 
                        </div>   
                        {
                            ch.topics?.map((tp, tpIndex) => {
                            return (
                                <>
                                <div className={ toggle === index ? 'flex  relative  hover:bg-gray-100 border border-solid mx-5 mb-1' : 'hidden' }>
                                <p className='p-2'>{tp.topName}</p>
                                <div className='flex items-center p-0'>
                                    <button className='flex p-0 absolute items-center  gap-1 right-3' onClick={()=>handleWatch(ch._id,tp._id)}>
                                        <RiVideoFill />
                                    </button>
                                </div> 
                                </div>
                            </>
                        ) } ) }                                           
                    </>)})
                }
                </div>
            </div>
        </div>
        <div className='w-full mt-5 rounded-lg items-center bg-gray-200 hover:bg-gray-100 cursor-pointer shadow-lg h-[50px]'>
            <p className='p-3 font-bold'>PDF File</p>
        </div>
    </div>
    </div>
  )
}
