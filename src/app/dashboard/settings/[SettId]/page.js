'use client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function SettingsPage({params}) {

  const [data, setData] = useState({webTitle:'', webTags:'', webCurr:'', metaData:''})
  const [errorMessage, setErrorMessage] = useState('');
  const [fileData, setFileData] = useState(null);
  const router = useRouter();

  useEffect(() =>{
    async function fetchData() {
      const setting = await fetch(`http://localhost:3000/api/settings/${params.SettId}`);
      const settingData = await setting.json();
      setData(settingData.result[0]);
    }
    fetchData();
  },[params.SettId])

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
   formData.set('image', fileData)
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

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage(''); //Clear the previous error
  let errMsg=[];

  if (!data.webTitle.trim()) {
    errMsg.push('Web title is required.');    
  }

  if (!data.webCurr.trim()) {
    errMsg.push('Currency is required.');    
  }

  if(errMsg.length>0){
    setErrorMessage(errMsg.join(' || '));
    return;
  }
  else
  {
  try
  {
    const result = await fetch (`http://localhost:3000/api/settings/${params.SettId}`, 
    {
      method:'PUT',
      body:JSON.stringify({webTitle:data.webTitle, webTags:data.webTags, webCurr:data.webCurr, metaData:data.metaData}),
    });

    const post = await result.json();
    console.log(post);
    setErrorMessage(''); //Clear the previous error
   
    {toast('Data saved successfully!', {

            hideProgressBar: false,
            autoClose: 2000,
            type: 'success'

            });
        router.push('/dashboard/settings/');
    }
    }catch(error) {
      console.log(error);
    }
  }
  }
  return (
    <div>
      <div className='relative bg-gray-100 w-full rounded-lg shadow-lg '>
        <div className='bg-amber-600 p-5 font-bold text-2xl'>
          <h1 className='text-white'>SEO SETTINGS -</h1>
        </div>
        <form className='p-9' encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className='flex flex-col mb-3 gap-2'>
            <label>Web Title:</label>
            <input type='text' name='webTitle' value={data.webTitle} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-600  '></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label>Web Tags:</label>
            <input type='text' name='webTags' value={data.webTags} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-600  '></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label>Meta Description:</label>
            <textarea type='text' name='metaData' value={data.metaData} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-600' rows='4'></textarea>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label>Currency:</label>
            <select type='select' name='webCurr' value={data.webCurr} onChange={handleChange} className='py-2 px-2 font-bold rounded-md border focus:outline-amber-600  '>
              <option value='' className='text-center'>--- Select Currency ---</option>
              <option value='USD' className='font-bold text-sm'>USD - [$]</option>
              <option  value='INR' className='font-bold text-sm'>INR - [&#8377;]</option>
              <option value='GBP' className='font-bold text-sm'>GBP - [£]</option>
              <option value='EURO'className='font-bold text-sm'>EURO - [€]</option>
            </select>
          </div>
          <div className='grid md:grid-cols-2 gap-1 w-full'>
            <div className='flex flex-col'>
              <label>Fevicon:</label>
              <div className='flex gap-1'>
                <input type='file' className='cursor-pointer w-full py-1 bg-white px-1 rounded-md border' onChange={handleFileChange}></input>
                <button type='button' onClick={handleFileUpload} className='py-2 px-2 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>UPLOAD</button>
              </div>
            </div>
            <div className='flex flex-col'>
              <label>Brand Logo:</label>
              <div className='flex  gap-1 '>
                <input type='file' className='cursor-pointer py-1 bg-white w-full px-1 rounded-md border' onChange={handleFileChange}></input>
                <button type='button' onClick={handleFileUpload} className='py-2 px-2 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>UPLOAD</button>
              </div>
            </div>
          </div>
          <div className='my-3'>
            <button type='submit' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>UPDATE</button>
          </div>
          {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}