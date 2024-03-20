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
            data.chapPdf = formData.secure_url;
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

    const handleRemoveFile = async (pdfUrl) => {   
    if(pdfUrl){
      const parts = pdfUrl.split('/'); // Split the URL by slashes ('/')
      const filename = parts.pop();  //and get the last part
      try 
      {
          const public_id = filename.split('.')[0]; // Split the filename by periods ('.') and get the first part
          const response = await fetch(`${BASE_API_URL}/api/removeimagefiles`, 
          {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ public_id }), // Send the file name to delete
          });

          const result = await response.json();
          if(result.success === true){
              toast('File removed successfully!', {
                  hideProgressBar: false,
                  autoClose: 1000,
                  type: 'success'      
              });
          }else{
              toast('File remove failed...!', {
                  hideProgressBar: false,
                  autoClose: 1000,
                  type: 'error'      
              });
          }      
      } catch (error) {
          console.error('Error deleting file:', error);
      }
      }
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
                            <input type='file' name='pdfFile' onChange={(e)=>handleFileChange(e.target.files[0])} className='w-full py-2 bg-white px-2 border rounded-md  focus:outline-amber-500'></input>
                            <button type='button' onClick={handleFileUpload} className='py-3 px-2 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>UPLOAD</button>
                        </div>
                    </div>
                    <div className='flex w-full h-10 flex-col mb-3 p-2 shadow-lg rounded-lg bg-gray-200'>
                        <div className='relative flex items-center'>
                            <div>
                              <p className='text-sm font-bold px-2 py-1'>PDF File</p>
                            </div>
                            <div className='absolute right-1 '>
                              <button type='button' onClick={()=>handleRemoveFile(data.chapPdf)} className='text-xs text-white rounded-sm font-bold px-2 py-1 bg-amber-500 hover:bg-amber-400'>X</button>
                            </div>
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
