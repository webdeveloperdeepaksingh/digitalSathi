'use client';
import React, { useState } from 'react';
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';


export default function AddCategory() {

  const router = useRouter();
  const [data, setData] = useState({catName:''})
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) =>{
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
    
    if (!data.catName.trim()) {
      errMsg.push('Category name is required.');    
    }
  
    if(errMsg.length>0){
      setErrorMessage(errMsg.join(' || '));
      return;
    }
  
    try
    {
      const result = await fetch ('http://localhost:3000/api/categories', 
      {
        method:'POST',
        body:JSON.stringify({catName: data.catName}),
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
        toast('Category added successfully!', 
          {
            hideProgressBar: false,
            autoClose: 2000,
            type: 'success'
          });
          router.push('/dashboard/categorylist');
        }
    }catch(error){
        console.log(error);    
      }    
    }

  return (
    <div>
      <div className='relative bg-gray-100 flex max-w-[450px] mx-auto p-5 shadow-lg rounded-lg'>
        <form className='p-2 w-full' onSubmit={handleSubmit}>
            <div className='flex flex-col mb-3 '>
                <label className='font-bold'>CATEGORY:</label>
                <input type='text' name='catName' value={data.catName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
            </div>
            <div className='mb-3'>
                <button type='submit' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>SAVE</button>
            </div>
            {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}
