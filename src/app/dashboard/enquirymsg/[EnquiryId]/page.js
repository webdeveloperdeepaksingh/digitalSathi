'use client';
import React from 'react';
import { useState, useEffect } from 'react';

export default function EnquiryMsg() {

  const [data, setData] = useState({eqrPerson:'', eqrSub:'', eqrEmail:'', eqrMsg:'', eqrPhone:''})

  return (
    <div>
       <div className='relative flex w-full shadow-lg rounded-lg p-6'>
            <div className='p-5 border border-solid mx-auto shadow-xl'>
                <form className='p-5  bg-gray-100'>
                    <div className='flex flex-col mb-2 gap-1'>
                        <label>Enquiry Person:</label>
                        <input type='text' name='eqrPerson' value={data.eqrPerson} className='py-2 px-2 mt-1 border rounded-md  focus:outline-amber-600' ></input>
                    </div>
                    <div className='flex flex-col mb-2 gap-1'>
                        <label>Enquiry Sub:</label>
                        <input type='text' name='eqrSub' value={data.eqrSub} className='py-2 px-2 mt-1 border rounded-md  focus:outline-amber-600' ></input>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 mb-2 gap-1'>
                        <div className='flex flex-col mb-3 gap-1'>
                            <label>Enquiry Email:</label>
                            <input type='email' name='eqrEmail' value={data.eqrEmail} className='py-2 px-2 mt-1 border rounded-md  focus:outline-amber-600' ></input>
                        </div>
                        <div className='flex flex-col mb-3 gap-1'>
                            <label>Enquiry Phone:</label>
                            <input type='text' name='eqrPhone' value={data.eqrPhone} className='py-2 px-2 mt-1 border rounded-md  focus:outline-amber-600' ></input>
                        </div>
                    </div>
                    <div className='flex flex-col mb-2 gap-1'>
                        <label>Enquiry Message:</label>
                        <textarea type='email' name='eqrEmail' value={data.eqrEmail}className='py-2 px-2 mt-1 border rounded-md  focus:outline-amber-600' rows={8} ></textarea>
                    </div>
                </form>
            </div>
       </div>
    </div>
  )
}
