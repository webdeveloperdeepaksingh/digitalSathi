'use client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SettingsPage({params}) {

  const [data, setData] = useState({brandTitle:'', brandTags:'', brandCurr:'', brandIntro:''})
  const [errorMessage, setErrorMessage] = useState('');
  


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
  setErrorMessage(''); //Clear the previous error
  let errMsg=[];

  if (!data.brandTitle.trim()) {
    errMsg.push('Web title is required.');    
  }

  if (!data.brandCurr.trim()) {
    errMsg.push('Currency is required.');    
  }

  if(errMsg.length>0){
    setErrorMessage(errMsg.join(' || '));
    return;
  }else
  {
  try
    {
      const result = await fetch ('http://localhost:3000/api/settings', 
      {
        method:'POST',
        body:JSON.stringify(
          {
            brandTitle:data.brandTitle, 
            brandTags:data.brandTags, 
            brandCurr:data.brandCurr, 
            brandIntro:data.brandIntro,
          }),
      });
      const post = await result.json();
      console.log(post);
      setErrorMessage(''); //Clear the previous error
      {toast('Data saved successfully!', {
          hideProgressBar: false,
          autoClose: 1500,
          type: 'success'
          });
        router.push('/dashboard/settings');
      }
      }catch(error) {
        console.log(error);
      }
    }
  }
  return (
    <div>
      <div className='relative bg-gray-100 w-full rounded-lg shadow-lg p-9'>
        <div className='bg-white border-2 rounded-md'>
          <h1 className='p-4 font-bold text-3xl text-center '>SEO SETTINGS </h1>
        </div>
        <form className='pt-4' encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className='flex flex-col mb-3 gap-2'>
            <label className='font-semibold uppercase'>Web Title:</label>
            <input type='text' name='brandTitle' value={data.brandTitle} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-600  '></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label className='font-semibold uppercase'>Web Tags:</label>
            <input type='text' name='brandTags' value={data.brandTags} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-600  '></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label className='font-semibold uppercase'>Web Intro:</label>
            <textarea type='text' name='brandIntro' value={data.brandIntro} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-600' rows='4'></textarea>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label className='font-semibold uppercase'>Currency:</label>
            <select type='select' name='brandCurr' value={data.brandCurr} onChange={handleChange} className='py-2 px-2 font-bold rounded-md border focus:outline-amber-600  '>
              <option value='' className='text-center'>--- Select Currency ---</option>
              <option value='USD' className='font-bold text-sm'>USD - [$]</option>
              <option  value='INR' className='font-bold text-sm'>INR - [&#8377;]</option>
              <option value='GBP' className='font-bold text-sm'>GBP - [£]</option>
              <option value='EURO'className='font-bold text-sm'>EURO - [€]</option>
            </select>
          </div>
          <div className='my-3'>
            <button type='submit' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>SAVE</button>
          </div>
          {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}