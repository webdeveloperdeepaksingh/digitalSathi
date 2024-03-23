'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import React from 'react';
import Cookies from 'js-cookie';
import { BASE_API_URL } from '../../../utils/constants';

export default function LoginPage() {

  const [data, setData] = useState({usrName:'', usrPass:'', usrEmail:''});
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); 

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
  
  if (!data.usrName?.trim() || '') {
    errMsg.push('User name is required.');    
  }
  
  if (!data.usrPass?.trim() || '') {
    errMsg.push('Password is required.');    
  }

  if(errMsg.length>0){
    setErrorMessage(errMsg.join(' || '));
    return;
  }

  try
  {
    const result = await fetch (`${BASE_API_URL}/api/login`, 
    {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({usrName: data.usrName, usrPass:data.usrPass}),
    });

      const post = await result.json();
      console.log(post);
    
    if(post.success==false){    //This line of code needed for server-side validation only, as written in USER Route API.
      if (Array.isArray(post.message)) {
        setErrorMessage(post.message.join(' || '));
        }
        else{
          setErrorMessage(post.message);
        }      
      }else
      {  
        Cookies.set("loggedInUserId", post.result.id); 
        Cookies.set("loggedInUserRole", post.result.role);
        Cookies.set("token", post.result.userToken);
        toast('Logged in successfully...!', 
        {
          hideProgressBar: false,
          autoClose: 1000,
          type: 'success'
        });     
        router.push('/dashboard/home');
      }
  }catch(error){
      console.log(error);    
    }    
  }

  return (
    <div >
      <title>DigitalSathi | Login </title>
      <div className='flex w-auto px-9 h-screen justify-center items-center'>
        <form className="flex flex-col w-[450px] p-9 mx-auto h-auto border-2 border-amber-500 shadow-xl rounded-lg" onSubmit={handleSubmit}>
          <div className='flex flex-col mb-3'>
              <label className="block font-semibold"> Username or Email </label>
              <input type="text" name='usrName' value={data.usrName} onChange={handleChange} placeholder="Email" className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-amber-500 focus:ring-1 rounded-md"/>
          </div>
          <div className='flex flex-col mb-3'>
              <label className="block font-semibold"> Password </label>
              <input type="password" name='usrPass' value={data.usrPass} onChange={handleChange} placeholder="Password" className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-amber-500 focus:ring-1 rounded-md"/>
          </div>
          <div className="flex justify-between items-baseline mb-3">
              <button type="submit" className="font-bold bg-gray-300 hover:bg-gray-200 text-black py-2 px-6 rounded-md">LOGIN</button>
              <div><Link href="/forgotpassword" className="text-sm hover:underline">Forgot Password?</Link></div>
          </div>
          {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
          <div className='flex  cursor-pointer justify-center mt-3 px-3 text-white hover:bg-amber-400 bg-amber-500 py-2 rounded-md'>
            <p>Not a member yet...?</p>
            <Link className='ml-2' href="/signup">Sign Up</Link>
          </div>
      </form> 
      </div>
    </div>
  )
}
