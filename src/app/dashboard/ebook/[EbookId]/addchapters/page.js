'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { BASE_API_URL } from '../../../../../../utils/constants';
import React, { useState, useEffect } from 'react'
import { RiDeleteBin5Fill } from 'react-icons/ri';
import Loading from '../../loading';

export default function AddEbookChap({params}) {

  const router = useRouter();
  const [chap, setChap] = useState([]);
  const [fileData, setFileData] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({chapName:'', chapPdf:''});
  const _id = params.EbookId;

  async function fetchEbookChap() {
    try {
      const response = await fetch(`${BASE_API_URL}/api/ebooks/${_id}/getchapters`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const chapters = await response.json();
      setChap(chapters.result);
     } catch (error) {
      console.error('Error:', error);
    }finally{
      setIsLoading(false);
    }
  }
  
  useEffect(() =>{    
    fetchEbookChap();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const handleFileChange = (e) => {
    setFileData(e.target.files?.[0])
  };

  const handleFileUpload = async (e) =>{
    e.preventDefault();
     const formData = new FormData();
     formData.set('pdfFile', fileData)
     const date = Date.now(); 
     data.chapPdf =`ebkChapPdf_${date}.${fileData.name.split('.').pop()}`;
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
    
    const result = await fetch (`${BASE_API_URL}/api/ebooks/${_id}/addchapter`, 
    {
      method:'POST',
      body:JSON.stringify({chapName: data.chapName, chapPdf: data.chapPdf}),
    });

    const post = await result.json();
 
    data.chapName='';
    data.chapPdf='';
    fetchEbookChap();

  }catch(error) {
      console.log(error);
    }
  }

  if(isLoading){
    return <div>
      <Loading/>
    </div>
  }

  return (
    <div>
        <div className='relative w-full p-5 shadow-lg rounded-lg'>
            <form className='p-9 m-5 border border-amber-500 rounded-md max-w-[550px]' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-3 mb-3'>
                    <div className='flex flex-col'>
                        <label className='font-bold'>CHAPTER:</label>
                        <input type='text' name='chapName' value={data.chapName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col mb-3'>
                        <label className='font-bold mb-2'>PDF File:</label>
                        <div className='flex items-center'>
                            <input type='file' name='pdfFile' onChange={handleFileChange} className='w-full py-2 bg-white px-2 border rounded-md  focus:outline-amber-500'></input>
                            <button type='button' onClick={handleFileUpload} className='py-3 px-2 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>UPLOAD</button>
                        </div>
                    </div>
                </div>
                <div>
                    <button type='submit' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>SAVE</button>
                </div>
            </form>
            <h1 className='text-center text-2xl rounded-sm py-2 mb-1 mx-5 bg-gray-200'>Ebook Contents </h1>
            <hr className='mx-5 mb-3'/>
            <div className='flex flex-col border border-solid pb-4 pt-6 mx-5 rounded-sm '>
                {
                    chap?.map((ch) => {
                    return (
                      <>
                        <div key={ch._id}  className='relative bg-gray-200 flex items-center mb-1 text-lg hover:bg-gray-100 rounded-sm border border-solid mx-5 font-bold cursor-pointer'>
                            <h1 className='uppercase p-2'>{ch.chapName}</h1>
                            <div className='flex items-center p-0'>
                              <button className='flex p-0 absolute items-center  gap-1 right-10'>
                                <Link href={`/dashboard/ebook/${_id}/addchapters/${ch._id}/updatechapter`} className='p-1 text-md text-gray-700 ' ><FaEdit /></Link>
                                <Link href={`/dashboard/ebook/${_id}/addchapters/${ch._id}/deletechapter`} className='text-gray-700 '><RiDeleteBin5Fill /></Link>
                              </button>
                            </div> 
                        </div>                                             
                      </>
                      )
                    })
                }
            </div>
        </div>
    </div>
  )
}


            

    
