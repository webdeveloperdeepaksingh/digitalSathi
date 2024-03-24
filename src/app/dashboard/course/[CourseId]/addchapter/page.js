'use client';
import Link from 'next/link';
import { BASE_API_URL } from '../../../../../../utils/constants';
import Loading from '../../loading';
import { FaEdit } from 'react-icons/fa';
import { IoIosArrowDown } from "react-icons/io";
import React, { useState, useEffect } from 'react'
import { MdAddBox } from "react-icons/md";
import { PiVideoBold } from "react-icons/pi";
import { RiDeleteBin5Fill } from 'react-icons/ri';


export default function AddChapter({params}) {

  const _id = params.CourseId;
  const [chap, setChap] = useState([]);
  const [data, setData] = useState({chapName:''});
  const [toggle, setToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleToggle = (index) => { 
    if(toggle === index){
      setToggle(null); 
    } else {
      setToggle(index);
    }
 }


  async function fetchChap() {
  try 
    {
      const response = await fetch(`${BASE_API_URL}/api/courses/${_id}/chapter`, {cache: "no-store"});
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const chapters = await response.json();
      setChap(chapters.result);
     } catch (error) {
      console.error('Error:', error);
    }finally{
      setIsLoading(false);
    }
  }
  
  useEffect(() =>{    
    fetchChap();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  
  const handleChange = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      setData((prev) =>{
      return {
          ...prev, [name]: value
      }
    }); 
  }
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  try
  {
      const result = await fetch (`${BASE_API_URL}/api/courses/${_id}/chapter`, 
    {
      method:'POST',
      body:JSON.stringify({chapName: data.chapName}),
    });

    const post = await result.json();
 
    data.chapName='';
    fetchChap();

  }catch(error) {
      console.log(error);
    }
}
  if(isLoading){
    return <div>
       <Loading/>
    </div>
  }
  return (
    <div>
        <div className='relative w-full p-5 shadow-lg rounded-lg'>
            <form className='p-5 max-w-[450px]' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-3 mb-3'>
                    <div className='flex flex-col'>
                        <label className='font-bold'>CHAPTER:</label>
                        <input type='text' name='chapName' value={data.chapName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                </div>
                <div>
                    <button type='submit' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>SAVE</button>
                </div>
            </form>
            <h1 className='text-center text-2xl rounded-sm py-2 mb-1 mx-5 bg-gray-200'>Course Contents </h1>
            <hr className='mx-5 mb-3'/>
            <div className='flex flex-col border border-solid pb-4 pt-6 mx-5 rounded-sm '>
                {
                    chap?.map((ch, index) => {
                    return (
                      <>
                        <div key={index}  onClick={() => handleToggle(index)} className={toggle === index ? 'relative bg-gray-200 flex items-center mb-1 text-lg hover:bg-gray-100 rounded-sm border border-solid mx-5 font-bold cursor-pointer' : 'relative flex bg-gray-200 items-center mb-1 text-lg hover:bg-gray-100 rounded-sm border border-solid mx-5 font-bold cursor-pointer'}>
                            <h1 className='uppercase p-2'>{ch.chapName}</h1>
                            <div className='flex items-center p-0'>
                              <button className='flex p-0 absolute items-center  gap-1 right-10'>
                                <Link href={`/dashboard/course/${_id}/addchapter/${ch._id}/updatechapter`} className='p-1 text-md text-gray-700 ' ><FaEdit /></Link>
                                <Link href={`/dashboard/course/${_id}/addchapter/${ch._id}/addtopic`} className='p-1 text-xl text-gray-700 ' ><MdAddBox/></Link>
                                <Link href={`/dashboard/course/${_id}/addchapter/${ch._id}/deletechapter`} className='text-gray-700 '><RiDeleteBin5Fill /></Link>
                              </button>
                              <span className={toggle === index ? 'absolute rotate-180 duration-500 top-3 right-3 text-2xl text-amber-500' : 'absolute duration-500 top-3 right-3 text-2xl text-amber-500'}><IoIosArrowDown/></span>
                            </div> 
                        </div>   
                        {
                          ch.topics?.map((tp, tpIndex) => {
                            return (
                              <>
                              <div className={ toggle === index ? 'flex  relative  hover:bg-gray-100 border border-solid mx-5 mb-1' : 'hidden' }>
                                <p className='p-2 flex items-center'><PiVideoBold className='mr-3 text-lg'/>{tp.topName}</p>
                                <div className='flex items-center p-0'>
                                  <button className='flex p-0 absolute items-center  gap-1 right-9'>
                                    <Link href={`/dashboard/course/${_id}/addchapter/${ch._id}/addtopic/${tp._id}/updatetopic`} className='p-1 text-md text-gray-700 ' ><FaEdit /></Link>
                                    <Link href={`/dashboard/course/${_id}/addchapter/${ch._id}/addtopic/${tp._id}/deletetopic`} className='p-1 text-md text-gray-700 '><RiDeleteBin5Fill /></Link>
                                  </button>
                                </div> 
                              </div>
                            </>
                          )
                          } )
                        }                                           
                      </>
                      )
                    })
                }
            </div>
        </div>
    </div>
  )
}
