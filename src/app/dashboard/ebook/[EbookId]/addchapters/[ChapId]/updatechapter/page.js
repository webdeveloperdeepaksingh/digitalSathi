'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '../../../../../../../../utils/constants';
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';


export default function UpdateEbookChap({params}) {

  const router = useRouter();
  const [fileData, setFileData] = useState(null);
  const [data, setData] = useState({chapName:'', chapPdf:''});


  useEffect(() =>{
    async function fetchData() {
      let chapData = await fetch(`${BASE_API_URL}/api/ebooks/${params.EbookId}/addchapter/${params.ChapId}/updatechapter`);
      chapData = await chapData.json();
      setData(chapData.result);
    }
    fetchData();
  },[params.EbookId, params.ChapId]);

  const handleFileChange = (e) => {
    setFileData(e.target.files?.[0])
    console.log(e.target.files?.[0]);
  };

  const handleFileUpload = async (e) =>{
    e.preventDefault();
     const formData = new FormData();
     formData.set('pdfFile', fileData)
     data.chapPdf =`ebkChapPdf_${params.ChapId}.${fileData.name.split('.').pop()}`;
     formData.set('fileName', data.chapPdf);
     const response = await fetch(`${BASE_API_URL}/api/pdffiles`, {
        method: 'POST',        
         body: formData
    });
    
    console.log(response);  
    toast('File uploaded successfully!', 
    {
      hideProgressBar: false,
      autoClose: 1000,
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
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  try
  {
    
    const result = await fetch (`${BASE_API_URL}/api/ebooks/${params.EbookId}/addchapter/${params.ChapId}/updatechapter`, 
    {
      method:'PUT',
      body:JSON.stringify({chapName: data.chapName, chapPdf:data.chapPdf}),
    });

    const post = await result.json();
    console.log(post);
    router.push(`/dashboard/ebook/${params.EbookId}/addchapters`);

    toast('Chapter updated successfully...!', 
    {
      hideProgressBar: false,
      autoClose: 1000,
      type: 'success'
    });

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
                        <label className='font-bold'>RENAME CHAPTER:</label>
                        <input type='text' name='chapName' value={data.chapName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md w-[400px]  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col mb-3'>
                        <label className='font-bold mb-2'>PDF File:</label>
                        <div className='flex items-center'>
                            <input type='file' name='pdfFile' onChange={handleFileChange} className='w-full py-2 bg-white px-2 border rounded-md  focus:outline-amber-500'></input>
                            <button type='button' onClick={handleFileUpload} className='py-3 px-2 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>UPLOAD</button>
                        </div>
                    </div>
                    <div className='flex w-full gap-1'>
                        <button type='submit' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>SAVE</button>
                        <button type='button' className='py-2 px-3 rounded-sm bg-gray-600 hover:bg-gray-500 text-white font-bold'>
                            <Link href={`/dashboard/ebook/${params.EbookId}/addchapters`}>BACK</Link>
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  )
}
