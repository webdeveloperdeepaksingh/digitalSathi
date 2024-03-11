'use client';
import React from 'react';
import Link from 'next/link';
import { BASE_API_URL } from '../../../../../../../../utils/constants';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';


export default function UpdateChapter({params}) {

  const _id = params.CourseId;
  const router = useRouter();
  const [data, setData] = useState({chapName:''});


  useEffect(() =>{
    async function fetchData() {
      let chapData = await fetch(`${BASE_API_URL}/api/courses/${_id}/chapter/${params.ChapId}`);
      chapData = await chapData.json();
      setData(chapData.result);
    }
    fetchData();
  },[_id, params.ChapId]);
  
  const handleChange = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      console.log(name, value);
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
    
    const result = await fetch (`${BASE_API_URL}/api/courses/${_id}/chapter/${params.ChapId}`, 
    {
      method:'PUT',
      body:JSON.stringify({chapName: data.chapName}),
    });

    const post = await result.json();
    console.log(post);
    router.push(`/dashboard/course/${_id}/addchapter`);

    toast('Chapter renamed...!', 
    {
      hideProgressBar: false,
      autoClose: 1000,
      type: 'success'
    });

  }catch(error) {
      console.log(error);
    }
}
  return (
    <div>
      <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
        <div className='flex flex-col max-w-[600px] mx-auto'>
            <div className='flex flex-col bg-white p-8 border border-solid rounded-md'>
                <form className='flex flex-col' onSubmit={handleSubmit}>
                    <div className='flex flex-col mb-3'>
                        <label className='font-bold'>RENAME CHAPTER:</label>
                        <input type='text' name='chapName' value={data.chapName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md w-[400px]  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex w-full gap-1'>
                        <button type='submit' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>SAVE</button>
                        <button type='button' className='py-2 px-3 rounded-sm bg-gray-600 hover:bg-gray-500 text-white font-bold'>
                            <Link href={`/dashboard/course/${params.CourseId}/addchapter`}>BACK</Link>
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  )
}
