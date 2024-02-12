'use client';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import NavBar from '@/components/NavBar/page';

export default function ForgotPassword() {

    const [pwd, setPwd] = useState({usrEmail:''});
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        console.log(name, value);
        setPwd((prev) =>{
            return {...prev,[name]:value  }
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); //Clear the previous error
        let errMsg=[];
        
        if (!pwd.usrEmail?.trim() || '') {
          errMsg.push('Please enter your email.');    
        }
      
        if(errMsg.length>0){
          setErrorMessage(errMsg.join(' || '));
          return;
        }
      
        try
        {
          const result = await fetch ('http://localhost:3000/api/forgotpassword', 
          {
            method:'PATCH',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({usrEmail: pwd.usrEmail}),
          });

          const post = await result.json();      
          
          if(post.success==false){    //This line of code needed for server-side validation only, as written in USER Route API.
            if (Array.isArray(post.message)) {
              setErrorMessage(post.message.join(' || '));
              }
              else{
              setErrorMessage(post.message);
              }      
            }else{
              toast('A password reset link sent to your email...!', {

                position: "bottom-center",
                hideProgressBar: false,
                autoClose: 5000,
                type: 'success'
              });
            }
        }catch(error){
            console.log(error);    
          }    
        }

  return (
    <div>
      <NavBar className='h-[90px]'/>
      <div className='flex flex-col h-screen w-auto mx-auto items-center justify-center px-9'>
        <div className="relative mx-auto text-center">
            <div className="mt-4 bg-white  rounded-lg text-left">
                <div className="h-2 bg-amber-600 rounded-t-md"></div>
                <form className="flex flex-col px-8 py-6 w-full shadow-2xl" onSubmit={handleSubmit}>
                    <span className='text-center p-3 bg-gray-100 font-bold rounded-md mb-3'>PASSWORD RESET REQUEST</span>
                    <div className='flex flex-col w-[360px] mb-3'>
                        <label className="block font-semibold">Email Id: </label>
                        <input type="email" name='usrEmail' value={pwd.usrEmail} onChange={handleChange} placeholder="Enter your registered email id." className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-amber-500 focus:ring-1 rounded-md"/>
                    </div>
                    {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
                    <button type='submit' className='flex cursor-pointer justify-center my-3 text-white hover:bg-amber-500 bg-amber-600 py-2 rounded-md'>SUBMIT</button>
                </form>  
            </div>
        </div>
      </div>
    </div>
  )
}
