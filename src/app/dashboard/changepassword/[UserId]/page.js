'use client';
import React from 'react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '../../../../../utils/constants';

export default function ChangePassword({params}) {

  const [data, setData] = useState({oldPass:'', usrPass:'', confPass:''});
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const _id = params.UserId;


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
    const result = await fetch (`${BASE_API_URL}/api/users/${_id}`, 
    {
      method:'PUT',
      body:JSON.stringify
      ({
          oldPass: data.oldPass, 
          usrPass:data.usrPass, 
          confPass:data.confPass, 
          isPasswordChangeRequest: true}),
      });

      const post = await result.json();
     
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
          autoClose: 1000,
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
      <div className='relative w-full bg-gray-100 rounded-lg shadow-lg p-9 '>
        <div className='rounded-sm border-2'>
          <h1 className='uppercase bg-amber-500 p-3 font-bold text-center text-white text-3xl'>Change Password</h1>
        </div>
        <form className='pt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col mb-3 gap-2'>
            <label className='font-semibold uppercase'>Old Password:*</label>
            <input type='password' name='oldPass' value={data?.oldPass} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500'></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label className='font-semibold uppercase'>New Password:*</label>
            <input type='password'name='usrPass' value={data?.usrPass} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500'></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label className='font-semibold uppercase'>Confirm Password:*</label>
            <input type='password' name='confPass' value={data?.confPass} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500'></input>
          </div>  
          <div className='mb-3'>
            <button type='submit' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>SAVE</button>
          </div>
          {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}