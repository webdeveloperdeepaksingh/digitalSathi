'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function UpdateUser({params}) {

  const [data, setData] = useState({usrName:'',  usrEmail:'', usrPhone:'', usrRole:''});
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const _id = params.UserId;

  useEffect(() =>{
    async function fetchData() {
      const userData = await fetch(`http://localhost:3000/api/users/${_id}`);
      const usrById = await userData.json();
      setData(usrById.result);
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

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
  
  if (!data.usrName.trim()) {
    errMsg.push('User name is required.');    
  }
  
  // if (!data.usrPass.trim()) {
  //   errMsg.push('Password is required.');    
  // }
  
  if (!data.usrEmail.trim()) {
    errMsg.push('Email is required.');    
  }
  
  if (!data.usrPhone.trim()) {
    errMsg.push('Phone is required.');    
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
      // body:JSON.stringify({usrName: data.usrName, usrPass:data.usrPass, usrEmail:data.usrEmail, usrPhone:data.usrPhone, usrRole:data.usrRole}),
      body:JSON.stringify({usrName: data.usrName, usrEmail:data.usrEmail, usrPhone:data.usrPhone, usrRole:data.usrRole}),
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
        toast('User updated successfully!', {
        hideProgressBar: false,
        autoClose: 2000,
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
      <div className='relative bg-gray-100 w-full rounded-lg shadow-lg '>
        <div className='bg-amber-600 p-5 font-bold text-xl'>
          <h1 className='text-white'>ACCOUNT SETTINGS: -</h1>
        </div>
        <form className='p-5' onSubmit={handleSubmit}>
          <div className='flex flex-col mb-3 gap-2'>
            <label>Username:</label>
            <input type='text' name='usrName' value={data.usrName} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-600'></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label>Email Id:</label>
            <input type='email' name='usrEmail' value={data.usrEmail} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-600'></input>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col mb-3 gap-2'>
                <label>Phone:</label>
                <input type='text' name='usrPhone' value={data.usrPhone} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-600' placeholder='with country code'></input>
            </div>
            <div className='flex flex-col mb-3 gap-2'>
                <label>Role:</label>
                <select type='select' name='usrRole' value={data.usrRole} onChange={handleChange} className='py-2 font-bold px-2 rounded-md border focus:outline-amber-600  '>
                   <option value='' className='text-center'>--- Select Role ---</option>
                   <option  value='ADMIN' className='font-bold text-sm'>ADMIN</option>
                   <option  value='INSTRUCTOR' className='font-bold text-sm'>INSTRUCTOR</option>
                   <option value='STUDENT' className='font-bold text-sm'>STUDENT</option>
                </select>
            </div>
          </div>
          <div className='mb-3'>
            <button type='submit' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>UPDATE</button>
          </div>
          {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}