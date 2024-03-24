'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { BASE_API_URL } from '../../../../utils/constants';

export default function ResetPassword({params}) {

const [resetPwd, setResetPwd] = useState({usrPass:'', confPass:''});
const [errorMessage, setErrorMessage] = useState('');
const router = useRouter();

const handleChange = (e) =>{
    const name = e.target.name;
    const value = e.target.value;
    setResetPwd((prev) =>{
        return {...prev,[name]:value  }
    });
}

const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); //Clear the previous error
    let errMsg=[];
    
    if (!resetPwd.usrPass?.trim() || '') {
        errMsg.push('Please enter new password.');    
    }

    if (!resetPwd.confPass?.trim() || '') {
        errMsg.push('Please confirm new password.');    
        }
    
    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }
    
    try
    {
        const result = await fetch (`${BASE_API_URL}/api/resetpassword`, 
        {
        method:'PATCH',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({token: params.Token, usrPass: resetPwd.usrPass , confPass:resetPwd.confPass}),
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
            toast('Password reset succesfully...!', {

            position: "bottom-center",
            hideProgressBar: false,
            autoClose: 5000,
            type: 'success'
            });
            router.push('/login');
        }
    }catch(error){
        console.log(error);    
        }    
    }
  return (
    <div>
       <div className='flex flex-col h-screen w-auto mx-auto items-center justify-center px-9'>
        <div className="relative mx-auto text-center">
            <div className="mt-4 bg-white  rounded-lg text-left">
                <div className="h-2 bg-amber-600 rounded-t-md"></div>
                <form className="flex flex-col px-8 py-6 w-full shadow-2xl" onSubmit={handleSubmit}>
                    <span className='text-center p-3 bg-gray-100 font-bold rounded-md mb-3'>RESET YOUR PASSWORD</span>
                    <div className='flex flex-col w-[460px] mb-3'>
                        <label className="block font-semibold">New Password: </label>
                        <input type="password" name='usrPass' value={resetPwd.usrPass} onChange={handleChange} placeholder="min 8 alpha-numeric + special char." className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-amber-500 focus:ring-1 rounded-md"/>
                    </div>
                    <div className='flex flex-col w-[460px] mb-3'>
                        <label className="block font-semibold">Confirm Password: </label>
                        <input type="password" name='confPass' value={resetPwd.confPass} onChange={handleChange} placeholder="min 8 alpha-numeric + special char." className="border w-full h-5 px-3 py-5 mt-2 hover:outline-none focus:outline-none focus:ring-amber-500 focus:ring-1 rounded-md"/>
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
