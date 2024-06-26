'use client';
import React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '../../../../utils/constants';

export default function AddUser() {

  const [data, setData] = useState({usrName:'', usrPass:'', usrEmail:'', usrPhone:'', usrRole:''});
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

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
  
  if (!data.usrName.trim()) {
    errMsg.push('User name is required');    
  }
  
  if (!data.usrPass.trim()) {
    errMsg.push('Password is required');    
  }
  
  if (!data.usrEmail.trim()) {
    errMsg.push('Email is required.');    
  }
  
  if (!data.usrPhone.trim()) {
    errMsg.push('Phone is required.');    
  }

  if (!data.usrRole.trim()) {
    errMsg.push('Please select role.');    
  }

  if(errMsg.length>0){
    setErrorMessage(errMsg.join(' || '));
    return;
  }

  try
  {
    const result = await fetch (`${BASE_API_URL}/api/users`, 
    {
      method:'POST',
      body:JSON.stringify({usrName: data.usrName, usrPass:data.usrPass, usrEmail:data.usrEmail, usrPhone:data.usrPhone, usrRole:data.usrRole}),
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
        toast('User added successfully!', 
      {
        hideProgressBar: false,
        autoClose: 1000,
        type: 'success'
      });
      router.push('/dashboard/userlist');
      }
  }catch(error){
      console.log(error);    
    }    
  }
  return (
    <div>
      <div className='relative w-full  bg-gray-100 rounded-lg shadow-lg p-9'>
        <div className='bg-amber-500 p-5  rounded-sm'>
          <h1 className='text-white text-center text-3xl font-bold'>CREATE USER ACCOUNT</h1>
        </div>
        <form className='py-4 px-2' onSubmit={handleSubmit}>
          <div className='flex flex-col mb-3 gap-2'>
            <label>Username:*</label>
            <input type='text' name='usrName' value={data.usrName} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500'></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label>Create Password:*</label>
            <input type='password' name='usrPass' value={data.usrPass} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500'></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label>Email Id:*</label>
            <input type='email' name='usrEmail' value={data.usrEmail} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500'></input>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col mb-3 gap-2'>
                <label>Phone:*</label>
                <input type='text' name='usrPhone' value={data.usrPhone} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500' placeholder='with country code'></input>
            </div>
            <div className='flex flex-col mb-3 gap-2'>
                <label>Role:*</label>
                <select type='select' name='usrRole' value={data.usrRole} onChange={handleChange} className='py-2 font-bold px-2 rounded-md border focus:outline-amber-500  '>
                   <option value='' className='text-center'>--- Select Role ---</option>
                   <option  value='ADMIN' className='font-bold text-sm'>ADMIN</option>
                   <option  value='INSTRUCTOR' className='font-bold text-sm'>INSTRUCTOR</option>
                   <option value='STUDENT' className='font-bold text-sm'>STUDENT</option>
                </select>
            </div>
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