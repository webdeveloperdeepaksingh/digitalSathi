'use client';
import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '../../../../../utils/constants';
import Loading from '../loading';


export default function UpdateCategory({params}) {

  const router = useRouter();
  const [data, setData] = useState({catName:''})
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  

  useEffect(() =>{
    async function fetchData() {
    try 
      {
        const res = await fetch(`${BASE_API_URL}/api/categories/${params.CatId}`, {cache: "no-store"});
        if (!res.ok) {
          throw new Error('Error fetching category data.');
        }
        const catdata = await res.json();
        setData(catdata.result[0]);
      } catch (error) {
        console.error('Error fetching category data: ', error);
      } finally {
        setIsLoading(false); 
      }
    }
    fetchData();
  },[params.CatId]);

  if (isLoading) {
    return <div><Loading/></div>; 
  }


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
      const result = await fetch (`${BASE_API_URL}/api/categories/${params.CatId}`, 
      {
        method:'PUT',
        body:JSON.stringify({catName: data.catName }),
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
        toast('Category updated...!', 
          {
            hideProgressBar: false,
            autoClose: 1000,
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
                <button type='submit' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>UPDATE</button>
            </div>
            {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}
