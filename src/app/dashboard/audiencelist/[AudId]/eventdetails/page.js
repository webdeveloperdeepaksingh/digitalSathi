"use client";
import Loading from '@/app/dashboard/loading';
import { BASE_API_URL } from '../../../../../../utils/constants';
import React, { useEffect, useState } from 'react';

export default function EventDetails({params}) {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({prodName:'', prodAuth:'', prodValue:'', prodCont:'', prodDate:'', prodTime:''});

    useEffect(()=>{
    async function fetchEventDetails(){
        try 
        {
            const res = await fetch(`${ BASE_API_URL }/api/audience/${params.AudId}`)
            if(!res.ok){
                throw new Error("Error fetching aud data.");
            }
            const audData = await res.json();
            setData(audData.result);
        } catch (error) {
            console.error("Error fetching aud data: ", error);
        }finally{
            setIsLoading(false);
        }
    }
    fetchEventDetails();
    },[params.AudId]);

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

  if(isLoading)
  {
    return <div><Loading/></div>
  }

  return (
    <div >
       <div className='flex flex-col max-w-[470px] my-16 p-9 bg-gray-100 border border-solid border-amber-500 rounded-lg shadow-lg mx-auto'>
            <div className='flex flex-col mb-3'>
               <label className='font-semibold'>Event Name:</label>
               <input type='text' name='prodName' value={data.prodName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
            </div>
            <div className='flex flex-col mb-3'>
               <label className='font-semibold'>Event Price:</label>
               <input type='text' name='prodValue' value={data.prodValue} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
            </div>
            <div className='grid md:grid-cols-2 gap-1'>
                <div className='flex flex-col mb-3'>
                    <label className='font-semibold'>Host Name:</label>
                    <input type='text' name='prodAuth' value={data.prodAuth} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div> 
                <div className='flex flex-col mb-3'>
                    <label className='font-semibold'>Host Contact:</label>
                    <input type='text' name='prodCont' value={data.prodCont} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
            </div>  
            <div className='grid md:grid-cols-2 gap-1'>
                <div className='flex flex-col mb-3'>
                    <label className='font-semibold'>Event Date:</label>
                    <input type='text' name='prodDate' value={data.prodDate} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
                <div className='flex flex-col mb-3'>
                    <label className='font-semibold'>Event Time:</label>
                    <input type='text' name='prodTime' value={data.prodTime} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
            </div>
       </div>
    </div>
  )
}
