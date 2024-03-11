'use client';
import React from 'react';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '../../../../../utils/constants';
import Loading from '../loading';

export default function UpdateUser({params}) {

  const [data, setData] = useState({usrName:'', usrEmail:'', usrPhone:'', usrRole:''});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const _id = params.UserId;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/users/${_id}`);
        if (!res.ok) {
          throw new Error('Error fetching user data.');
        }
        const usrById = await res.json();
        setData(usrById.result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false); // Mark loading as complete
      }
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  if (isLoading) {
    return <div><Loading/></div>; // Show loading state
  }

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
    const result = await fetch (`${BASE_API_URL}/api/users/${_id}`, 
    {
      method:'PUT',
      body:JSON.stringify
      ({
        usrName: data.usrName,  
        usrEmail:data.usrEmail, 
        usrPhone:data.usrPhone, 
        usrRole:data.usrRole
      }),
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
        toast('User updated successfully!', 
      {
        hideProgressBar: false,
        autoClose: 1000,
        type: 'success'
      });
      router.push(`/dashboard/account/${_id}`);
      }
  }catch(error){
      console.log(error);    
    }    
  }
  return (
    <div>
      <div className='relative w-full bg-gray-100 rounded-lg shadow-lg p-9 '>
        <div className='bg-amber-500 p-3 font-bold text-center text-white text-3xl rounded-sm border-2'>
          <h1>ACCOUNT SETTINGS</h1>
        </div>
        <form className='pt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col mb-3 gap-2'>
            <label className='font-semibold uppercase'>User Name:</label>
            <input type='text' name='usrName' value={data?.usrName} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500'></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label className='font-semibold uppercase'>Email Id:</label>
            <input type='email'name='usrEmail' value={data?.usrEmail} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500'></input>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col mb-3 gap-2'>
                <label className='font-semibold uppercase'>Phone:</label>
                <input type='text' name='usrPhone' value={data?.usrPhone} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500'></input>
            </div>
            <div className='flex flex-col mb-3 gap-2'>
                <label className='font-semibold uppercase'>Role:</label>
                <select disabled type='select' name='usrRole' value={data?.usrRole} onChange={handleChange} className='py-2 font-bold px-2 rounded-md border focus:outline-amber-500  '>
                   <option value='' className='text-center'>--- Select Role ---</option>
                   <option  value='INSTRUCTOR' className='font-bold text-sm'>INSTRUCTOR</option>
                   <option value='STUDENT' className='font-bold text-sm'>STUDENT</option>
                </select>
            </div>
          </div>
          <div className='mb-3'>
            <button type='submit' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>UPDATE</button>
          </div>
          {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}