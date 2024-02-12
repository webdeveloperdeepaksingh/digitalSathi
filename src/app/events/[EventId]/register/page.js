'use client';
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar/page';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


export default function RegisterEvent({params}) {

  const [data, setData] = useState({partName:'', prodName:'', partEmail:'', partPhone:'', partPay:'', hostContact:'', userId:''});
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

    if (!data.partName?.trim() || '') {
      errMsg.push('Name is required.');    
    }

    if (!data.partEmail?.trim() || '') {
      errMsg.push('Please enter your email.');    
    }

    if (!data.partPhone?.trim() || '') {
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
        body:JSON.stringify(
          {
            partName:data.partName, 
            prodName:data.prodName, 
            partEmail:data.partEmail, 
            partPhone:data.partPhone, 
            partPay:data.partPay, 
            hostContact:data.prodAuth, 
            userId:data.userId
          }),
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
        toast('Registered successfully!', {
          hideProgressBar: false,
          autoClose: 2000,
          type: 'success'
        });
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
              <input type='text' name='partName' value={data.partName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
          </div>
          <div className='flex flex-col mb-3'>
              <label className='font-bold'>Email:*</label>
              <input type='email' name='partEmail' value={data.partEmail} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
          </div>
          <div className='flex flex-col mb-3'>
              <label className='font-bold'>Phone:*</label>
              <input type='text' name='partPhone' value={data.partPhone} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
          </div>
          <div className='flex flex-col mb-5'>
              <label className='font-bold'>Registering For:*</label>
              <input disabled type='text' name='prodName' value={data.prodName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
          </div>
          <div className='flex-col mb-5  hidden'>
              <label className='font-bold'>User Id:*</label>
              <input type='text' name='userId' value={data.userId} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
          </div>
          <div className='flex-col mb-5 hidden'>
              <label className='font-bold'>Host Number:*</label>
              <input type='text' name='userId' value={data.prodAuth} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
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
