'use client';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { FaCloudUploadAlt } from "react-icons/fa";
import Image from 'next/image';
import { useRef } from "react";
import React from 'react';
import TextEditor from '@/components/TinyMce/Editor';
import Cookies from 'js-cookie';

export default function UpdateCourse({params}) {
   
    const inputRef = useRef();
    const router = useRouter();
    const [cat, setCat] = useState([]); 
    const [image, setImage] = useState('');
    const [imageData, setImageData] = useState(null); 
    const [errorMessage, setErrorMessage] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
    const [data, setData] = useState({prodName:'', prodTags:'', prodIntro:'', prodAuth:'', prodTax:'', prodDisct:'', prodDesc:'', prodPrice:'', prodDisc:'', prodVal:'', prodCat:'', prodImage:''})    
    

    useEffect(() =>{
      async function fetchData() {
      let catdata = await fetch('http://localhost:3000/api/categories/?userId='+ loggedInUser.result._id);
      catdata = await catdata.json();
      setCat(catdata);
    }
      fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() =>{
        async function fetchData() {
        const courseData = await fetch(`http://localhost:3000/api/courses/${params.CourseId}`);
        const course = await courseData.json();
        setData(course.result);
        setEditorContent(course.result.prodDesc)
        setImage(`/images/${course.result.prodImage}`) 
        }
    fetchData();
    },[params.CourseId]);
    
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
            data.prodImage=`coImage_${params.CourseId}.${imageData.name.split('.').pop()}`;
            formData.set('fileName', data.prodImage);
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
        setEditorContent(newContent);
        console.log(editorContent);
      }
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); //Clear the previous error
    let errMsg=[];
    
    if (!data.prodName.trim()) {
        errMsg.push('Course title is required.');    
    }
    
    if (!data.prodCat.trim()) {
        errMsg.push('Please select category.');    
    }

    if (!data.prodTax.trim()) {
        errMsg.push('Please enter tax rate.');    
    }

    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }
    try
    {
      const result = await fetch (`http://localhost:3000/api/courses/${params.CourseId}`, 
      {
        method:'PUT',
        body:JSON.stringify(
            {
                prodName: data.prodName, 
                prodTags:data.prodTags, 
                prodIntro:data.prodIntro, 
                prodAuth: data.prodAuth,
                prodTax:data.prodTax, 
                prodDisct:data.prodDisct, 
                prodDesc:editorContent, 
                prodPrice:data.prodPrice, 
                prodDisc:data.prodDisc, 
                prodVal:data.prodVal, 
                prodCat:data.prodCat, 
                prodImage:data.prodImage
            }),
      });

      const post = await result.json();
      console.log(post);
      setErrorMessage(''); //Clear the previous error
        if(post.success==false){
            if (Array.isArray(post.message)) {
            setErrorMessage(post.message.join(' || '));
            }else{
            setErrorMessage(post.message);
            }      
        }else{
            toast('Course updated successfully!', {
                hideProgressBar: false,
                autoClose: 1500,
                type: 'success'
            });
            router.push(`/dashboard/course/${params.CourseId}/addchapter`);
        }    
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
                    <div className='relative flex flex-col group bg-white  h-[260px] max-w-[800px] border border-solid rounded-md'>
                        <Image className='w-[100%] h-[100%]' alt='image' src={image} style={{ objectFit: 'cover' }} fill></Image>
                        <div className='hidden group-hover:block mx-auto mt-auto cursor-pointer  opacity-50 text-gray-300  text-4xl'>
                            <button type='button' onClick={showChooseFileBox} id='fileUpload'><FaCloudUploadAlt/></button>
                        </div>
                        <p className='text-sm mt-auto ml-auto  opacity-50'>Size:[260*800]</p>
                    </div>
                    <div className='flex flex-col'>
                        <div className='hidden border border-solid'>
                            <input type='file' id='fileUpload' ref={inputRef} accept='image/*' name='image' onChange={handleImage} ></input>
                        </div>
                        <div className='flex justify-center'>
                            <button type='button' onClick={handleImageUpload} className='w-full mt-3 py-2 px-2 rounded-md bg-white hover:bg-gray-50 text-amber-600 text-md font-bold border border-solid border-amber-600'>UPLOAD</button>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-3'> 
                    <div className='flex flex-col'>
                        <label>Course Title:</label>
                        <input type='text' name='prodName' value={data.prodName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Course Tags:</label>
                        <input type='text' name='prodTags' value={data.prodTags} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Course Instructor:</label>
                        <input type='text' name='prodAuth' value={data.prodAuth} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Short Intro:</label>
                        <textarea type='text' name='prodIntro' value={data.prodIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600' rows='4'></textarea>
                    </div>
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='mb-2'>Course Description:</label>
                <TextEditor value={editorContent} handleEditorChange={handleEditorChange}  />
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-3'> 
                <div className='flex flex-col'>
                    <label>Original Price:</label>
                    <input type='text' name='prodPrice' value={data.prodPrice} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Discounted Price:</label>
                    <input type='text' name='prodDisc' value={data.prodDisc} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-3'> 
                <div className='flex flex-col'>
                    <label>Tax Rate:</label>
                    <input type='number' name='prodTax' value={data.prodTax} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Discount %:</label>
                    <input type='number' name='prodDisct' value={data.prodDisct} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
            </div>
            <div className='grid md:grid-cols-2 mb-5 gap-3'> 
                <div className='flex flex-col'>
                    <label>Course Validity:</label>
                    <select type='select' name='prodVal' value={data.prodVal} onChange={handleChange} className='py-2 font-bold px-2 mt-2 border rounded-md  focus:outline-amber-600'>
                        <option value='' className='text-center'>--- Choose Validity ---</option>
                        <option value='lifeTime'>Lifetime</option>
                        <option value='days-360'>Days - 360</option>
                        <option value='days-180'>Days - 180</option>
                    </select>
                </div>
                <div className='flex flex-col'>
                    <label>Category:</label>
                    <select type='select' name='prodCat' value={data.prodCat} onChange={handleChange} className='py-2 px-2 mt-2 font-bold border rounded-md  focus:outline-amber-600'>
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
            <button type='submit' className='py-2 px-3 mb-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>UPDATE & NEXT</button>
            {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}

    
