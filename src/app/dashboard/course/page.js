'use client';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { FaCloudUploadAlt } from "react-icons/fa";
import Image from 'next/image';
import { useRef } from "react";
import React from 'react';
import TextEditor from '@/components/TinyMce/Editor';

export default function AddCourse() {
   
    const inputRef = useRef();
    const router = useRouter();
    const [cat, setCat] = useState([]); 
    const [image, setImage] = useState('');
    const [imageData, setImageData] = useState(null); 
    const [data, setData] = useState({coName:'', coTags:'', coIntro:'', coDesc:'', coPrice:'', coDisc:'', coVal:'', coCat:'', coImage:''})    
    

    useEffect(() =>{
      async function fetchData() {
        let catdata = await fetch('http://localhost:3000/api/categories');
        catdata = await catdata.json();
        setCat(catdata);
      }
      fetchData();
    },[]);

    const showChooseFileBox = () =>{
        inputRef.current.click();
    };

    const handleImage = (e) => {
        setImage(URL.createObjectURL(e.target.files?.[0]));
        setImageData(e.target.files?.[0])
        console.log(e.target.files?.[0]);
      };
    
      const handleImageUpload = async (e) =>{
        e.preventDefault();
         const formData = new FormData();
         formData.set('image', imageData);  
         const date = Date.now();      
         data.coImage = `coImage_${date}.${imageData.name.split('.').pop()}`;
         formData.set('fileName', data.coImage);
         const response = await fetch('http://localhost:3000/api/imagefiles', {
            method: 'POST',        
            body: formData
        });
        
        console.log(response);  
        toast('Image uploaded successfully!', {
          hideProgressBar: false,
          autoClose: 2000,
          type: 'success'      
        });
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

    const handleEditorChange = (newContent) => {
        data.coDesc= newContent;
        console.log(data.coDesc);
    }
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    try
    {
      const result = await fetch ('http://localhost:3000/api/courses', 
      {
        method:'POST',
        body:JSON.stringify({coName: data.coName, coTags:data.coTags, coIntro:data.coIntro, coDesc:data.coDesc, coPrice:data.coPrice, coDisc:data.coDisc, coVal:data.coVal, coCat:data.coCat, coImage:data.coImage}),
      });

      const post = await result.json();
      console.log(post);

      toast('Course added successfully!', {

        hideProgressBar: false,
        autoClose: 2000,
        type: 'success'

        });
        router.push('/dashboard/courselist');
        // router.push(`/dashboard/course/${post.result._id}/chapter`);

    }catch(error) {
        console.log(error);
      }
  }

  return (
    <div>
      <div className='relative flex  justify-center  bg-gray-100  w-full p-6 shadow-lg rounded-lg'>
        <form className='p-3 w-full' encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='grid md:grid-cols-2 w-full mb-3 gap-6'>
                <div>
                    <div className='flex items-center justify-center group bg-white relative h-[260px] max-w-[800px] border border-solid'>
                        <Image className='w-[100%] h-[100%]' alt='image' src={image} style={{ objectFit: 'cover' }} fill></Image>
                        <div className='hidden group-hover:block absolute cursor-pointer  opacity-50 text-gray-300  text-4xl'>
                            <button type='button' onClick={showChooseFileBox} id='fileUpload'><FaCloudUploadAlt/></button>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='hidden border border-solid'>
                            <input type='file' id='fileUpload' ref={inputRef} accept='image/*' name='image' onChange={handleImage} ></input>
                        </div>
                        <div className='flex justify-center'>
                            <button type='button' onClick={handleImageUpload} className='w-full mt-3 py-2 px-2 rounded-sm bg-white hover:bg-gray-50 text-black text-md font-bold border border-solid border-black'>UPLOAD</button>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-3'> 
                    <div className='flex flex-col'>
                        <label>Course Title:</label>
                        <input type='text' name='coName' value={data.coName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Course Tags:</label>
                        <input type='text' name='coTags' value={data.coTags} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Short Intro:</label>
                        <textarea type='text' name='coIntro' value={data.coIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600' rows='4'></textarea>
                    </div>
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='mb-2'>Course Description:</label>
                <TextEditor value={data.coDesc} handleEditorChange={handleEditorChange}  />
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-3'> 
                    <div className='flex flex-col'>
                        <label>Original Price:</label>
                        <input type='text' name='coPrice' value={data.coPrice} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Discounted Price:</label>
                        <input type='text' name='coDisc' value={data.coDisc} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
            </div>
            <div className='grid md:grid-cols-2 mb-5 gap-3'> 
                <div className='flex flex-col'>
                    <label>Course Validity:</label>
                    <select type='select' name='coVal' value={data.coVal} onChange={handleChange} className='py-2 font-bold px-2 mt-2 border rounded-md  focus:outline-amber-600'>
                        <option value='' className='text-center'>--- Choose Validity ---</option>
                        <option value='lifeTime'>Lifetime</option>
                        <option value='days-360'>Days - 360</option>
                        <option value='days-180'>Days - 180</option>
                    </select>
                </div>
                <div className='flex flex-col'>
                    <label>Category:</label>
                    <select type='select' name='coCat' value={data.coCat} onChange={handleChange} className='py-2 px-2 mt-2 font-bold border rounded-md  focus:outline-amber-600'>
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
            <div className='grid md:grid-cols-2 gap-3 w-full'>
                <button type='button' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>SAVE</button>
                <button type='submit' className='py-2 px-3 rounded-sm bg-gray-600 hover:bg-gray-500 text-white font-bold'>SAVE & NEXT</button>
            </div>
        </form>
      </div>
    </div>
  )
}

    
