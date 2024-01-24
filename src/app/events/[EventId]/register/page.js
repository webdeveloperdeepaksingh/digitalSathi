'use client';
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar/page';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function RegisterEvent({params}) {

  const [data, setData] = useState({audName:'', evtName:'', audEmail:'', audPhone:'', audPay:'', userId:''});
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(()  =>{
    async function fetchData(){
      const res = await fetch(`http://localhost:3000/api/events/${params.EventId}`)
      const evtData = await res.json();
      setData(evtData.result);
    }
    fetchData();
  }, [params.EventId])

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

    if (!data.audName?.trim() || '') {
      errMsg.push('Name is required.');    
    }

    if (!data.audEmail?.trim() || '') {
      errMsg.push('Please enter your email.');    
    }

    if (!data.audPhone?.trim() || '') {
      errMsg.push('Please enter your phone.');    
    }

    if(errMsg.length>0){
      setErrorMessage(errMsg.join(' || '));
      return;
    }

    try
    {
      const result = await fetch ('http://localhost:3000/api/audience', 
      {
        method:'POST',
        body:JSON.stringify({audName:data.audName, evtName:data.evtName, audEmail:data.audEmail, audPhone:data.audPhone, audPay:data.audPay, userId:data.userId}),
      });

      const post = await result.json();
      console.log(post);
      setErrorMessage(''); //Clear the previous error
      if(post.success==false){
          if (Array.isArray(post.message)) {
          setErrorMessage(post.message.join(' || '));
          }else{
          setErrorMessage(post.message);
          }      
        }
      else
      {
        // toast('Ebook added successfully!', {

        //       hideProgressBar: false,
        //       autoClose: 2000,
        //       type: 'success'

        //       });
        router.push(`/events/${params.EventId}`);
      }
      }catch(error) {
        console.log(error);
      }
}

  return (
    <div >
      <div className='h-[90px]'><NavBar/></div>
      <div className='max-w-[650px] mx-auto p-9 rounded-xl my-12'>
        <form className='p-9 shadow-xl rounded-lg border  border-amber-600 ' onSubmit={handleSubmit}>
          <div className='flex flex-col mb-3'>
              <label className='font-bold'>Full Name:*</label>
              <input type='text' name='audName' value={data.audName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
          </div>
          <div className='flex flex-col mb-3'>
              <label className='font-bold'>Email:*</label>
              <input type='email' name='audEmail' value={data.audEmail} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
          </div>
          <div className='flex flex-col mb-3'>
              <label className='font-bold'>Phone:*</label>
              <input type='text' name='audPhone' value={data.audPhone} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
          </div>
          <div className='flex flex-col mb-5'>
              <label className='font-bold'>Registering For:*</label>
              <input disabled type='text' name='evtName' value={data.evtName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
          </div>
          <div className='flex-col mb-5  hidden'>
              <label className='font-bold'>User Id:*</label>
              <input type='text' name='evtName' value={data.userId} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
          </div>
          <div className='flex gap-1 mb-3'>
            <button type='submit' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>SUBMIT</button>
            <Link href={`/events/${params.EventId}`} type='button' className='py-2 px-3 rounded-sm bg-gray-500 hover:bg-gray-400 text-white font-bold'>CANCEL</Link>
          </div>
          {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}
