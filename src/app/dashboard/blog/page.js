'use client';
import TextEditor from '@/components/TinyMce/Editor';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { BASE_API_URL } from '../../../../utils/constants';
import { useRef } from 'react';
import React from 'react';
import Cookies from 'js-cookie';

export default function AddBlog() {

    const router = useRouter();
    const [cat, setCat] = useState([]);  
    const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"), usrRole:Cookies.get("loggedInUserRole")}};    
    const [errorMessage, setErrorMessage] = useState(''); 
    const [data, setData] = useState({blgName:'', blgTags:'', shortIntro:'', prodType:'events', blgDesc:'', blgCat:'', blgAuth:'', })    

    useEffect(() => {
        async function fetchData() {
          try {
            const response = await fetch(`${ BASE_API_URL }/api/categories`);
            if (!response.ok) {
              throw new Error('Error fetching category data');
            }
            const catData = await response.json();
            setCat(catData);
          } catch (error) {
            console.error('Error fetching data:', error);
          } 
        }
        fetchData();
      }, []);

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

    const handleEditorChange = (newContent) => {
        data.blgDesc= newContent;
        console.log(data.blgDesc);
    }
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); //Clear the previous error

    let errMsg=[];
    
    if (!data.blgName.trim()) {
        errMsg.push('Blog title is required.');    
    }
    
    if (!data.blgCat.trim()) {
        errMsg.push('Please select category.');    
    }

    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }

    try
    {
      const result = await fetch (`${ BASE_API_URL }/api/blogs`, 
      {
        method:'POST',
        body:JSON.stringify(
            {
                blgName:data.blgName, 
                blgTags:data.blgTags, 
                shortIntro:data.shortIntro, 
                blgDesc:data.blgDesc, 
                blgCat:data.blgCat, 
                blgAuth:data.blgAuth,  
                userId: loggedInUser.result?._id
            }),
      });

      const post = await result.json();
      console.log(post);

    if(post.success==false){    //This line of code needed for server-side validation only as written in USER Route API.
        if (Array.isArray(post.message)) {
            setErrorMessage(post.message.join(' || '));
            }else{
                setErrorMessage(post.message);
            }      
    }else
    {
    toast('Blog created successfully!', 
      {
        hideProgressBar: false,
        autoClose: 1000,
        type: 'success'
      });
      router.push('/dashboard/bloglist');
      }
    }catch(error) {
        console.log(error);
      }
  }
  
  return (
    <div>
      <div className='flex flex-col  bg-gray-100 justify-center w-full p-9 shadow-lg rounded-lg'>
        <div className='px-3 py-3 text-center bg-white text-2xl font-bold rounded mb-3'>
            <h1 className='uppercase'>Create Blog</h1>
        </div>
        <form className='w-full' encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='flex flex-col mb-3'>
                <label>Blog Title:</label>
                <input type='text' name='blgName' value={data.blgName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
            </div> 
            <div className='flex flex-col mb-3'>
                <label>Blog Tags:</label>
                <input type='text' name='blgTags' value={data.blgTags} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-1'> 
                <div className='flex flex-col'>
                    <label>Blog Author:</label>
                    <input type='text' name='blgAuth' value={data.blgAuth} onChange={handleChange} className='py-2 font-bold px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Category:</label> 
                    <select type='select'name='blgCat' value={data.blgCat} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'>
                    <option value='' className='text-center'>--- Choose Category ---</option>
                        {
                            cat.map((item) => {
                                return(
                                    <option value={item.catName} key={item._id}>{item.catName}</option>
                                )
                            })
                        }
                    </select>
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label>Short Intro:</label>
                <textarea type='text' name='shortIntro' value={data.shortIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500' rows='4'></textarea>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='mb-3'>Blog Description:</label>
                <TextEditor value={data.blgDesc} handleEditorChange={handleEditorChange}/>
            </div>
            <div className='mb-3'>
                <button type='submit' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>SAVE</button>
            </div>
            {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}

    
