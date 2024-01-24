'use client';
import React from 'react';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePassword({params}) {

  const [data, setData] = useState({oldPass:'', usrPass:'', confPass:''});
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const _id = params.UserId;


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
  
  if (!data.oldPass.trim()) {
    errMsg.push('Old Password is required.');    
  }
  
  if (!data.usrPass.trim()) {
    errMsg.push('New password is required.');    
  }

  if (!data.confPass.trim()) {
    errMsg.push('Confirm password is required.');    
  }
  

  if(errMsg.length>0){
    setErrorMessage(errMsg.join(' || '));
    return;
  }

  try
  {
    const result = await fetch (`http://localhost:3000/api/users/${_id}`, 
    {
      method:'PUT',
      body:JSON.stringify({oldPass: data.oldPass, usrPass:data.usrPass, confPass:data.confPass, isPasswordChangeRequest: true}),
    });

      const post = await result.json();
      console.log(post);
    
    if(post.success==false){    //This line of code needed for server-side validation only as written in USER Route API.
      if (Array.isArray(post.message)) {
        setErrorMessage(post.message.join(' || '));
        }
        else{
        setErrorMessage(post.message);
        }      
      }
    else{
        toast('Password changed successfully!', 
        {
          hideProgressBar: false,
          autoClose: 2000,
          type: 'success'
        });
      router.push(`/dashboard/changepassword/${_id}`);
      }
  }catch(error){
      console.log(error);    
    }    
  }
  return (
    <div>
      <div className='relative w-full bg-gray-100 rounded-lg shadow-lg '>
        <div className='bg-amber-600 p-5 font-bold text-2xl'>
          <h1 className='text-white uppercase'>Change Password: -</h1>
        </div>
        <form className='p-5' onSubmit={handleSubmit}>
          <div className='flex flex-col mb-3 gap-2'>
            <label>Old Password:*</label>
            <input type='password' name='oldPass' value={data?.oldPass} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-600'></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label>New Password:*</label>
            <input type='password'name='usrPass' value={data?.usrPass} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-600'></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label>Confirm Password:*</label>
            <input type='password' name='confPass' value={data?.confPass} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-600'></input>
          </div>  
          <div className='mb-3'>
            <button type='submit' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>SAVE</button>
          </div>
          {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}