'use client';
import React, { useEffect, useState } from 'react';
import { RiVideoFill } from "react-icons/ri";
import { IoIosArrowDown } from 'react-icons/io';
import { PiDownload } from "react-icons/pi";
import Loading from '../loading';
import { BASE_API_URL } from '../../../../../utils/constants';


export default function WatchCourse({params}) {

const [isLoading, setIsLoading] = useState(true);
const [top, setTop] = useState('');
const [chap, setChap] = useState([]);
const [toggle, setToggle] = useState(false);

const handleWatch=(chapId, topId)=>{
    async function fetchTop(){
    try 
        {
            const response = await fetch(`${BASE_API_URL}/api/courses/${params.CourseId}/chapter/${chapId}/topic/${topId}`);
            if(!response){
                throw new Error("Error fetching topics.");
            }
            const topData = await response.json();
            setTop(topData.result);
        } catch (error) {
            console.error("Error fetchig data: ", error);
        }finally{
            setIsLoading(false);
        }
        }
        fetchTop();
    }

useEffect(() =>{  
async function fetchChap() {
    try 
    {
        const response = await fetch(`${BASE_API_URL}/api/courses/${params.CourseId}/chapter`);
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        const chapters = await response.json();
        setChap(chapters.result);      
        handleWatch(chapters.result[0]?._id, chapters.result[0]?.topics[0]?._id);             
    } catch (error) {
        console.error('Error:', error);
    }finally{
        setIsLoading(false);
    }
}
fetchChap();    
// eslint-disable-next-line react-hooks/exhaustive-deps
},[params.CourseId]);

 const handleToggle = (index) => { 
    if(toggle === index){
        setToggle(null); 
    } else {
        setToggle(index);
    }
}

const handleDownload = (pdfName) =>{
    const fileUrl = `/pdf/${pdfName}`; // Path to pdf file.
    const fileName = `${top.topName}`; // Desired filename for the downloaded file.
    // Create a new link element
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = fileName;
    // Append the link to the DOM
    document.body.appendChild(anchor);
    // Trigger the 'click' event
    anchor.click();
    // Remove the link element from the DOM
    document.body.removeChild(anchor);
}

if(isLoading){
    return <div><Loading/></div>
}

  return (
    <div>
    <div className='relative flex flex-col w-full p-9 shadow-lg rounded-lg'>
    <div>
        <div className='md:flex  w-auto gap-2 h-auto'>
            <div className='flex flex-col w-full border border-solid p-5 rounded-lg'>
                <h3 className='bg-gray-600 text-xl text-white text-center p-5'>TOPIC: {top.topName} </h3>
                <div className='flex w-full justify-center'>
                    <div className='w-full md:h-[450px] h-[300px] border border-solid'>
                        <iframe className="w-full aspect-video h-full" src={top.videoUrl}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        >
                        </iframe>
                    </div>
                </div>           
            </div>
            <div className='flex flex-col min-w-[300px] overflow-auto border border-solid pb-4 pt-6  rounded-lg'>
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
        <div className='relative flex w-full mt-5 rounded-lg items-center bg-gray-200 hover:bg-gray-100 cursor-pointer shadow-lg h-[50px]'>
            <p className='p-3 font-bold'>{top.topName}</p>
            <button type='button' onClick={() => handleDownload(top.pdfFile)} className='w-auto absolute right-6 font-bold text-xl'><PiDownload /></button>
        </div>
    </div>
    </div>
  )
}