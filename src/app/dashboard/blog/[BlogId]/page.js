'use client';
import TextEditor from '@/components/TinyMce/Editor';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import Image from 'next/image';
import React from 'react';

export default function UpdateBlog({params}) {

    const inputRef = useRef();
    const router = useRouter();
    const [cat, setCat] = useState([]);     
    const [image, setImage] = useState(''); 
    const [imageData, setImageData] = useState(null); 
    const [errorMessage, setErrorMessage] = useState(''); 
    const [editorContent, setEditorContent] = useState('');
    const [data, setData] = useState({blgName:'', blgTags:'', shortIntro:'', blgDesc:'', blgCat:'', blgAuth:'', blgImage:'' })    
    
    useEffect(() =>{
      async function fetchCat() {
        let catdata = await fetch('http://localhost:3000/api/categories');
        catdata = await catdata.json();
        setCat(catdata);
      }
      fetchCat();
    },[]);

    useEffect(() =>{
        async function fetchData() {
          const blog = await fetch(`http://localhost:3000/api/blogs/${params.BlogId}`);
          const blgData = await blog.json();                    
          setData(blgData.result);   
          setEditorContent(blgData.result.blgDesc)   
          setImage(`/images/${blgData.result.blgImage}`)    
        }
        fetchData();        
    },[params.BlogId]);

    const showChooseFileBox = () =>{
        inputRef.current.click();
    };

    const handleImage = (e) => {
        setImage(URL.createObjectURL(e.target.files?.[0]));        
        setImageData(e.target.files?.[0])
        console.log(e.target.files?.[0]);
      };
    
    const handleImageUpload = async (e) =>{
        const formData = new FormData();
        formData.set('image', imageData);             
        data.blgImage=`blgImage_${params.BlogId}.${imageData.name.split('.').pop()}`;
        formData.set('fileName', data.blgImage);
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
      const result = await fetch (`http://localhost:3000/api/blogs/${params.BlogId}`, 
      {
        method:'PUT',
        body:JSON.stringify({blgName:data.blgName, blgTags:data.blgTags, shortIntro:data.shortIntro, blgDesc:editorContent, blgCat:data.blgCat, blgAuth:data.blgAuth, blgImage:data.blgImage}),
      });

      const post = await result.json();
      console.log(post);

    if(post.success==false){    //This line of code needed for server-side validation only as written in USER Route API.
        if (Array.isArray(post.message)) {
            setErrorMessage(post.message.join(' || '));
            }else{
                setErrorMessage(post.message);
            }      
    }else{
        toast('Blog updated successfully!', {
        hideProgressBar: false,
        autoClose: 2000,
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
      <div className='relative flex  bg-gray-100 justify-center w-full p-6 shadow-lg rounded-lg'>
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
                        <label>Blog Title:</label>
                        <input type='text' name='blgName' value={data.blgName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Blog Tags:</label>
                        <input type='text' name='blgTags' value={data.blgTags} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Short Intro:</label>
                        <textarea type='text' name='shortIntro' value={data.shortIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600' rows='4'></textarea>
                    </div>
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='mb-3'>Blog Description:</label>
                <TextEditor value={editorContent} handleEditorChange={handleEditorChange}/>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                <div className='flex flex-col'>
                    <label>Blog Author:</label>
                    <input type='text' name='blgAuth' value={data.blgAuth} onChange={handleChange} className='py-2 font-bold px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Category:</label> 
                    <select type='select'name='blgCat' value={data.blgCat} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'>
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
            <div className='mb-3'>
                <button type='submit' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>UPDATE</button>
            </div>
            {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}
