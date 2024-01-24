'use client';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import Footer from '@/components/Footer/page';
import NavBar from '@/components/NavBar/page';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import React from 'react';

export default function LoginPage() {

  const [data, setData] = useState({usrName:'', usrPass:'', usrEmail:''});
  const [errorMessage, setErrorMessage] = useState('');
  const {setLoggedInUser} = useContext(UserContext);
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
    const result = await fetch ('http://localhost:3000/api/login', 
    {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({usrName: data.usrName, usrPass:data.usrPass}),
    });

      const post = await result.json();
      setLoggedInUser(post); //set the LoggedInUserData in global state.
      console.log(post);
    
    if(post.success==false){    //This line of code needed for server-side validation only, as written in USER Route API.
      if (Array.isArray(post.message)) {
        setErrorMessage(post.message.join(' || '));
        }
        else{
        setErrorMessage(post.message);
        }      
      }else{
        toast('Logged in successfully!', {

          hideProgressBar: false,
          autoClose: 2000,
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
    <NavBar/>
        <div className="relative w-[500px] mx-auto text-center py-40 ">
          <span className="text-2xl font-light ">Login to your account</span>
          <div className="mt-4 bg-white  rounded-lg text-left">
            <div className="h-2 bg-amber-600 rounded-t-md"></div>
            <form className="px-8 py-6 w-full shadow-2xl" onSubmit={handleSubmit}>
                <div className='flex flex-col'>
                    <label className="block font-semibold"> Username or Email </label>
                    <input type="text" name='usrName' value={data.usrName} onChange={handleChange} placeholder="Email" className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-amber-500 focus:ring-1 rounded-md"/>
                </div>
                <div className='flex flex-col'>
                    <label className="block mt-3 font-semibold"> Password </label>
                    <input type="password" name='usrPass' value={data.usrPass} onChange={handleChange} placeholder="Password" className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-amber-500 focus:ring-1 rounded-md"/>
                </div>
                <div className="flex justify-between items-baseline">
                    <button type="submit" className="mt-4 font-bold bg-gray-200 text-black py-2 px-6 rounded-md">LOGIN</button>
                    <Link href="/forgetpassword" className="text-sm hover:underline">Forgot Password?</Link>
                </div>
                {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
                <div className='flex cursor-pointer justify-center mt-4 text-white hover:bg-amber-500 bg-amber-600 py-2 rounded-md'>
                  <p>Not a member yet...?</p>
                  <Link className='ml-2' href="/signup">Sign Up</Link>
                </div>
            </form>  
          </div>
        </div>
        <Footer/>
      </div>
  )
}
