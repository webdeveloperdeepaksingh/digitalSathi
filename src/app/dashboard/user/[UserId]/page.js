'use client';
import React from 'react';
import { BASE_API_URL } from '../../../../../utils/constants';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Loading from '../loading';

export default function UpdateUser({params}) {

  const [data, setData] = useState({usrName:'',  usrEmail:'', usrPhone:'', usrRole:''});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const _id = params.UserId;

  useEffect(() =>{
    async function fetchData() {
    try 
      {
        const res = await fetch(`${BASE_API_URL}/api/users/${_id}`, {cache: "no-store"});
        if(!res.ok){
          throw new Error("Error fetching user data.");
        }
        const usrById = await res.json();
        setData(usrById.result);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }finally{
        setIsLoading(false);
      }
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
        toast('User updated successfully!', {
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

  if(isLoading){
    return <div>
      <Loading/>
    </div>
  }

  return (
    <div>
      <div className='relative bg-gray-100 w-full rounded-lg shadow-lg p-9'>
        <div className='bg-amber-500 border-2 rounded-sm'>
          <h1 className='p-4 font-bold text-white text-3xl text-center '>ACCOUNT SETTINGS</h1>
        </div>
        <form className='py-3 px-2' onSubmit={handleSubmit}>
          <div className='flex flex-col mb-3 gap-2'>
            <label className='font-semibold uppercase'>Username:</label>
            <input type='text' name='usrName' value={data.usrName} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500'></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label className='font-semibold uppercase'>Email Id:</label>
            <input type='email' name='usrEmail' value={data.usrEmail} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500'></input>
          </div>
          <div className='grid grid-cols-2 gap-1'>
            <div className='flex flex-col mb-3 gap-2'>
                <label className='font-semibold uppercase'>Phone:</label>
                <input type='text' name='usrPhone' value={data.usrPhone} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500' placeholder='with country code'></input>
            </div>
            <div className='flex flex-col mb-3 gap-2'>
                <label className='font-semibold uppercase'>Role:</label>
                <select type='select' name='usrRole' value={data.usrRole} onChange={handleChange} className='py-2 font-bold px-2 rounded-md border focus:outline-amber-500  '>
                   <option value='' className='text-center'>--- Select Role ---</option>
                   <option  value='ADMIN' className='font-bold text-sm'>ADMIN</option>
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