'use client';
import React from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar/page';
import Footer from '@/components/Footer/page';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {

  const [data, setData] = useState({usrName:'', usrPass:'', usrConfPass:'', usrEmail:'', usrPhone:'', usrRole:''});
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

  if (!data.usrConfPass?.trim() || '') {
    errMsg.push('Confirm password is required.');    
  }
  
  if (!data.usrEmail?.trim() || '') {
    errMsg.push('Email is required.');    
  }
  
  if (!data.usrPhone?.trim() || '') {
    errMsg.push('Phone is required.');    
  }

  if(errMsg.length>0){
    setErrorMessage(errMsg.join(' || '));
    return;
  }

  try
  {
    const result = await fetch ('http://localhost:3000/api/users', 
    {
      method:'POST',
      body:JSON.stringify({usrName: data.usrName, usrPass:data.usrPass, usrConfPass:data.usrConfPass, usrEmail:data.usrEmail, usrPhone:data.usrPhone, usrRole:data.usrRole}),
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
      }
    else{
      //   toast('User added successfully!', {
      //   hideProgressBar: false,
      //   autoClose: 2000,
      //   type: 'success'
      // });
      router.push('/login');
      }
  }catch(error){
      console.log(error);    
    }    
  }

  return (
    <div>
    <NavBar/>
      <div className="relative flex min-h-screen text-gray-800 antialiased items-center justify-center overflow-hidden">
        <div className="absolute top-28 py-3 w-[80%] lg:w-[40%] mx-auto text-center">
          <div className="mt-4 bg-white  rounded-lg text-left">
            <div className="h-2 bg-amber-500 rounded-t-md"></div>
            <form className="flex flex-col px-8 py-3 shadow-2xl"onSubmit={handleSubmit}>
              <div className='flex flex-col'>
                <label className="block font-semibold"> Full Name:*</label>
                <input type="text" name='usrName' value={data.usrName} onChange={handleChange} placeholder="Deepak Singh" className="mb-3 border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-amber-500 focus:ring-1 rounded-md"/>
              </div>
              <div className='flex flex-col'>
                <label className="block font-semibold"> Email Id:*</label>
                <input type="text" name='usrEmail' value={data.usrEmail} onChange={handleChange} placeholder="deepaksingh@gmail.com" className="mb-3 border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-amber-500 focus:ring-1 rounded-md"/>
              </div>
              <div className='flex gap-1'>
                <div className='w-[50%]'>
                    <label className="block font-semibold"> Phone:*</label>
                    <input type="text" name='usrPhone' value={data.usrPhone} onChange={handleChange} placeholder="with country code e.g.+91" className="mb-3 border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-amber-500 focus:ring-1 rounded-md"/>
                </div>
                <div className='w-[50%]'>
                    <label className="block font-semibold"> Join As:*</label>
                    <select type='select' name='usrRole' value={data.usrRole} onChange={handleChange} className="mb-3 border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-amber-500 focus:ring-1 rounded-md">
                        <option value='' className='text-center'>--- Select Role ---</option>
                        <option value="STUDENT">STUDENT</option>
                        <option value="INSTRUCTOR">INSTRUCTOR</option>
                    </select>
                </div>
              </div>
              <div className='flex flex-col'>
                <label className="block font-semibold">Create Password:* </label>
                <input type="password" name='usrPass' value={data.usrPass} onChange={handleChange} placeholder="min 8 alpha-numeric + special char." className="mb-3 border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-amber-500 focus:ring-1 rounded-md"/>
              </div>
              <div className='flex flex-col'>
                <label className="block font-semibold">Confirm Password:* </label>
                <input type="password" name='usrConfPass' value={data.usrConfPass} onChange={handleChange} placeholder="min 8 alpha-numeric + special char." className="mb-3 border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-amber-500 focus:ring-1 rounded-md"/>
              </div>
              {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
              <div className="flex justify-between items-baseline">
                <button type="submit" className="mt-2 font-bold bg-gray-500 hover:bg-gray-400 text-white py-2 px-6 w-full rounded-md">SIGN UP</button>
              </div>
              <div className='flex justify-center mt-4'>
                  <p>Already a member...?</p>
                  <Link className='ml-2' href="/login">Login</Link>
              </div>
            </form>  
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </div>
  )
}
