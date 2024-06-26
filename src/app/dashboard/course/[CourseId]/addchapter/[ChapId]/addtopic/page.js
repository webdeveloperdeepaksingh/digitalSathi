'use client';
import Link from 'next/link';
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../../../../../../../../utils/constants';

export default function AddTopic({params}) {
  const [data, setData] = useState({topName:'', videoUrl:'', pdfFile:'', chapId:''})
  const [topList, setTopList] = useState([]);
  const [chap, setChap] = useState([]);
  const _id = params.ChapId;
  const [fileData, setFileData] = useState(null);
  const router = useRouter();

  useEffect(() =>{
    async function fetchTopList(){
    try 
      {
        const response = await fetch(`${BASE_API_URL}/api/courses/${params.CourseId}/chapter/${params.ChapId}`, {cache: "no-store"});
        const topData = await response.json();
        setTopList(topData);
      } catch (error) {
        console.error("Error fetching topList: ", error);
      }  
    }
    fetchTopList();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[])

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) =>{
    return {
        ...prev, [name]: value
    }
  }); 
}

const handleFileChange = (pdfNote) => {
  if(pdfNote){
    setFileData(pdfNote);
  } 
};

  const handleFileUpload = async (e) => {
  e.preventDefault();
  const formData = new FormData();

  if (!fileData) {
      alert('No file selected.');
  }else if (!fileData.type.startsWith('image/')) {
      alert('Only image files (JPEG, JPG, PNG ) are allowed.');
  }else if(fileData.size > 10485760){   //in bytes
      alert('Image size exceeds the maximum allowed limit of 10MB.');
  }else{
      formData.append('file', fileData);
      formData.append('upload_preset', 'pdf_upload');
      formData.append('cloud_name', 'dlnjktcii');
      
      fetch('https://api.cloudinary.com/v1_1/dlnjktcii/image/upload', {
          method: 'POST',
          body: formData
      })
      .then((res) => res.json())
      .then((formData) => {
          data.pdfFile = formData.secure_url;
          if(formData.secure_url){
              toast('File uploaded successfully!', {
                  hideProgressBar: false,
                  autoClose: 1000,
                  type: 'success'      
              });
          }
          else{
              toast('File upload failed...!', {
                  hideProgressBar: false,
                  autoClose: 1000,
                  type: 'error'      
              });
          }
      })
      .catch((err) => {
          console.error('Error uploading file:', err);
          toast('File upload failed...!', {
              hideProgressBar: false,
              autoClose: 1000,
              type: 'error'      
          });
      });
    }   
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try
    {        
    const result = await fetch (`${BASE_API_URL}/api/courses/${params.CourseId}/chapter/${_id}/topic`, 
    {
      method:'POST',
      body:JSON.stringify
      ({
        topName:data.topName, 
        videoUrl:data.videoUrl, 
        pdfFile:data.pdfFile, 
        chapId:data.chapId
      }),
    });

    const post = await result.json();
    toast('Topic added successfully!', 
    {
      hideProgressBar: false,
      autoClose: 1000,
      type: 'success'
    });
      router.push(`/dashboard/course/${params.CourseId}/addchapter`);

    }catch(error) {
        console.log(error);
    }
    }

  return (
    <div>
      <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
        <div className='flex flex-col max-w-[600px] mx-auto'>
            <div className='flex flex-col bg-white p-8 border border-solid rounded-md'>
                <form className='flex flex-col' onSubmit={handleSubmit}>
                    <div className='flex flex-col mb-3'>
                        <label className=''>Topic Name:</label>
                        <input type='text' name='topName' value={data.topName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col mb-3'>
                        <label className=''>Video Url:</label>
                        <input type='text' name='videoUrl' value={data.videoUrl} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col mb-3'>
                        <label className=''>Choose file:</label>
                        <input type='file' name='pdfFile' onChange={(e)=>handleFileChange(e.target.files[0])} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                        <button type='button' onClick={handleFileUpload} className='w-full mt-3 py-2 px-2 rounded-sm bg-amber-500 hover:bg-amber-400 text-white text-md font-bold'>UPLOAD</button>
                    </div>
                    <div className='flex w-full gap-1'>
                        <button type='submit' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>SAVE</button>
                        <button type='button' className='py-2 px-3 rounded-sm bg-gray-600 hover:bg-gray-500 text-white font-bold'>
                            <Link href={`/dashboard/course/${params.CourseId}/addchapter`}>BACK</Link>
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  )
}
