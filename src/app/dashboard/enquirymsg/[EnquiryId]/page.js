'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';

export default function EnquiryMsg({params}) {

  const [data, setData] = useState({eqrPerson:'', eqrSub:'', eqrEmail:'', eqrMsg:'', eqrPhone:''})
  useEffect(()=>{
    async function fetchData(){
        const res = await fetch(`http://localhost:3000/api/enquiries/${params.EnquiryId}`);
        const eqrData = await res.json();
        setData(eqrData.result);
    }
    fetchData();
  },[params.EnquiryId])

  return (
    <div>
       <div className='flex w-full shadow-lg rounded-lg p-9'>
       <form className='p-9  bg-gray-100 w-full'>
            <div className='flex flex-col mb-2 gap-1'>
                <label className='uppercase font-semibold'>Enquiry Person:</label>
                <input type='text' name='eqrPerson' value={data.eqrPerson} className='py-2 px-2 mt-1 border rounded-md  focus:outline-amber-600' ></input>
            </div>
            <div className='flex flex-col mb-2 gap-1'>
                <label className='uppercase font-semibold'>Enquiry Sub:</label>
                <input type='text' name='eqrSub' value={data.eqrSub} className='py-2 px-2 mt-1 border rounded-md  focus:outline-amber-600' ></input>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 mb-2 gap-1'>
                <div className='flex flex-col mb-3 gap-1'>
                    <label className='uppercase font-semibold'>Enquiry Email:</label>
                    <input type='email' name='eqrEmail' value={data.eqrEmail} className='py-2 px-2 mt-1 border rounded-md  focus:outline-amber-600' ></input>
                </div>
                <div className='flex flex-col mb-3 gap-1'>
                    <label className='uppercase font-semibold'>Enquiry Phone:</label>
                    <input type='text' name='eqrPhone' value={data.eqrPhone} className='py-2 px-2 mt-1 border rounded-md  focus:outline-amber-600' ></input>
                </div>
            </div>
            <div className='flex flex-col mb-2 gap-1'>
                <label className='uppercase font-semibold'>Enquiry Message:</label>
                <textarea type='email' name='eqrEmail' value={data.eqrEmail}className='py-2 px-2 mt-1 border rounded-md  focus:outline-amber-600' rows={8} ></textarea>
            </div>
        </form>
       </div>
    </div>
  )
}
