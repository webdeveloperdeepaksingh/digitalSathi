'use client';
import TextEditor from '@/components/TinyMce/Editor';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import React from 'react';

export default function Profile({params}) {

  const [data, setData] = useState({proName:'', proFather:'', proDob:'', proJob:'', proQual:'', shortIntro:'', proAbout:'', proCloc:'', proPloc:'', proImage:''})
  const [editorContent, setEditorContent] = useState('');
  const [imageData, setImageData] = useState(null); 
  const [fileData, setFileData] = useState(null);
  const [image, setImage] = useState(''); 
  const router = useRouter();
  const inputRef = useRef();

  useEffect(() =>{
    async function fetchData() {
      const proData = await fetch(`http://localhost:3000/api/profile/${params.ProId}`);
      const profileData = await proData.json();
      setData(profileData.result[0]);
      setEditorContent(profileData.result[0].proAbout)
      setImage(`/images/${profileData.result[0].proImage}`)
    }
    fetchData();
  },[params.ProId])

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
    data.proImage=`proImage_${params.ProId}.${imageData.name.split('.').pop()}`;
    formData.set('fileName', data.proImage);
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

  const handleFileChange = (e) => {
    setFileData(e.target.files?.[0])
    console.log(e.target.files?.[0]);
  };

  const handleFileUpload = async (e) =>{
  e.preventDefault();
   const formData = new FormData();
   formData.set('pdfFile', fileData)
   const response = await fetch('http://localhost:3000/api/pdffiles', {
      method: 'POST',        
      body: formData
  });
  
  console.log(response);  
  toast('File uploaded successfully!', {
    hideProgressBar: false,
    autoClose: 2000,
    type: 'success'      
    });
}
  const handleEditorChange = (newContent) => {
  setEditorContent(newContent);
  console.log(editorContent);
}
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  try
  {
    const result = await fetch (`http://localhost:3000/api/profile/${params.ProId}`, 
    {
      method:'PUT',
      body:JSON.stringify({proName:data.proName, proFather:data.proFather, proDob:data.proDob, proJob:data.proJob, proQual:data.proQual, shortIntro:data.shortIntro, proAbout:editorContent, proImage:data.proImage, proCloc:data.proCloc, proPloc:data.proPloc}),
    });

    const post = await result.json();
    console.log(post);   
    {toast('Profile saved successfully!', {

            hideProgressBar: false,
            autoClose: 2000,
            type: 'success'

            });
        router.push(`/dashboard/profile/${params.ProId}`);
    }
    }catch(error) {
      console.log(error);
    }
  }
    
  return (
    <div>
      <div className='relative flex bg-gray-100  w-full p-6 shadow-lg rounded-lg'>
        <form className='p-3 w-full' encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='grid md:grid-cols-2 w-full mb-3 gap-6'>
              <div>
                <div className='flex items-center justify-center group bg-white relative h-[362px] max-w-[800px] border border-solid'>
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
                      <label>Full Name:*</label>
                      <input type='text' name='proName' value={data.proName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                  </div>
                  <div className='flex flex-col'>
                      <label>Father Name:*</label>
                      <input type='text' name='proFather' value={data.proFather} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                  </div>
                  <div className='flex flex-col'>
                      <label>Date of Birth:*</label>
                      <input type='date' name='proDob' value={data.proDob} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                  </div>
                  <div className='flex flex-col'>
                      <label>Profession:</label>
                      <input type='text' name='proJob' value={data.proJob} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                  </div>
                  <div className='flex flex-col'>
                      <label>Qualification:*</label>
                      <input type='text' name='proQual' value={data.proQual} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                  </div>
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label>Short Intro:</label>
                <textarea type='text' name='shortIntro' value={data.shortIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600' rows='4'></textarea>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='mb-3'>About Me:</label>
                <TextEditor value={editorContent} handleEditorChange={handleEditorChange}/>
            </div>
            <div className='flex flex-col mb-3'>
                <label>Address Proof:</label>
                <div className='flex items-center'>
                    <input type='file' className='py-2 w-full px-2 mt-2 bg-white border rounded-md  focus:outline-amber-600'onChange={handleFileChange} ></input>
                    <button type='button' onClick={handleFileUpload} className='py-2 px-2 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>UPLOAD</button>
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label>Id Proof:</label>
                <div className='flex items-center'>
                    <input type='file' className='py-2 px-2 w-full mt-2 bg-white border rounded-md  focus:outline-amber-600' onChange={handleFileChange} ></input>
                    <button type='button' onClick={handleFileUpload} className='py-2 px-2 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>UPLOAD</button>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-3'>
                <div className='flex flex-col mb-3'>
                    <label>Permanent Address:</label>
                    <textarea type='text' name='proPloc' value={data.proPloc} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600' rows='4'></textarea>
                </div>
                <div className='flex flex-col mb-3'>
                    <label>Current Address:</label>
                    <textarea type='text' name='proCloc' value={data.proCloc} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600' rows='4'></textarea>
                </div>
            </div>
            <div className='mb-3'>
                <button type='submit' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>SAVE</button>
            </div>
        </form>
      </div>
    </div>
  )
}

    
