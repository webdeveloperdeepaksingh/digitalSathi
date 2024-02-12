'use client';
import React from 'react';
import Link from 'next/link';
import { RiVideoFill } from "react-icons/ri";
import { IoIosArrowDown } from 'react-icons/io';
import { useState, useEffect } from 'react';

export default function WatchTopic({params}) {

 const [top, setTop] = useState('');
 const [chap, setChap] = useState([]);
 const [toggle, setToggle] = useState(false);
 const PDF_FILE_URL = `http://localhost:3000/public/pdf/${top.pdfFile}`

 useEffect(() =>{  
    async function fetchChap() {
        try {
          const response = await fetch(`http://localhost:3000/api/courses/${params.CourseId}/chapter`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const chapters = await response.json();
          setChap(chapters.result);
         } catch (error) {
          console.error('Error:', error);
        }
      }
    fetchChap();
  },[params.CourseId]);


 useEffect(() =>{
    async function fetchTop(){
      const response = await fetch(`http://localhost:3000/api/courses/${params.CourseId}/chapter/${params.ChapId}/topic/${params.TopId}`);
      const topData = await response.json();
      setTop(topData.result);  
    }
    fetchTop();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[])

 const handleToggle = (index) => { 
    if(toggle === index){
        setToggle(null); 
    } else {
        setToggle(index);
    }
}
 const handleDownload = () => {
    const fileName = url.split("/").pop();
    const aTag = document.createComment("a");
    aTag.href = url;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
 }

  return (
    <div>
    <div className='relative flex flex-col w-full p-9 shadow-lg rounded-lg'>
    <div>
        <div className='md:flex w-auto gap-2'>
            <div className='flex flex-col w-full mb-3 border border-solid rounded-lg'>
                <h3 className='bg-gray-600 text-xl text-white text-center p-5'>TOPIC: {top.topName} </h3>
                <div className='flex w-full justify-center'>
                    <div className='w-full md:h-[350px] h-[300px] border border-solid'>
                        <iframe className="w-full aspect-video h-full" src={top.videoUrl}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        >
                        </iframe>
                    </div>
                </div>           
            </div>
            <div className='flex flex-col md:min-w-[400px] overflow-auto border-2 py-6  rounded-lg'>
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
                                <div key={tp._id} className={ toggle === index ? 'flex  relative  hover:bg-gray-100 border border-solid mx-5 mb-1' : 'hidden' }>
                                <p className='p-2'>{tp.topName}</p>
                                <div className='flex items-center p-0'>
                                    <button className='flex p-0 absolute items-center  gap-1 right-3'>
                                        <Link href={`/dashboard/course/${params.CourseId}/addchapter/${ch._id}/addtopic/${tp._id}/watchtopic`}  className='p-1 text-lg text-gray-700 '><RiVideoFill /></Link>
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
        <div  className='relative flex w-full mt-5 rounded-lg items-center bg-gray-200  cursor-pointer shadow-lg h-[50px]'>
            <p className='p-3 font-bold'>{top.topName}</p>
            <button onClick={() =>{handleDownload(PDF_FILE_URL)}} className='absolute right-3 px-2 py-2 text-xs mr-auto  uppercase font-bold shadow-lg rounded-sm bg-white'>Download Notes</button>
        </div>
    </div>
</div>

  )
}
