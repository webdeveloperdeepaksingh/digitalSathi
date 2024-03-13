'use client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../../../../../utils/constants';
import Loading from '../loading';
import Image from 'next/image';

export default function SettingsPage({params}) {

  const [data, setData] = useState({brandTitle:'', brandTags:'', brandTax:'', brandDisc:'', brandCurr:'', brandIntro:'', brandLogo:'', brandIcon:''})
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageFevIcon, setImageFevIcon] = useState(''); 
  const [imageBrandLogo, setImageBrandLogo] = useState(''); 
  const [fevIcon, setFevIcon] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const router = useRouter();

  useEffect(() =>{
    async function fetchData() {
    try 
      {
        const res = await fetch(`${BASE_API_URL}/api/settings/${params.SettId}`);
        if(!res.ok){
          throw new Error("Error fetching settData,");
        }
        const settingData = await res.json();
        setData(settingData.result);
        setImageFevIcon(`/images/${settingData.result.brandIcon}`);
        setImageBrandLogo(`/images/${settingData.result.brandLogo}`);
      } catch (error) {
        console.error("Error fetching data.", error);
      }finally{
        setIsLoading(false);
      }
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleImage = (icons, e) => {
    if(icons === "fvIcon"){
      setImageFevIcon(URL.createObjectURL(e.target.files?.[0]));
      setFevIcon(e.target.files?.[0]);
    }
    else{
      setImageBrandLogo(URL.createObjectURL(e.target.files?.[0]));    
      setBrandLogo(e.target.files?.[0]);
    }
    
    console.log(e.target.files?.[0]);
  };

  const handleImageUpload = async (doc) =>{
    let fileName="";
     const formData = new FormData();
     
    if(doc === "fvIcon"){      
      fileName = `${doc}_${params.SettId}.${fevIcon.name.split('.').pop()}`; 
      formData.set('image', fevIcon); 
      formData.set('fileName', fileName);
      data.brandIcon = fileName
    }else{      
      fileName = `${doc}_${params.SettId}.${brandLogo.name.split('.').pop()}`; 
      formData.set('image', brandLogo); 
      formData.set('fileName', fileName);
      data.brandLogo = fileName;
    }
     
     const response = await fetch(`${BASE_API_URL}/api/imagefiles`, {
        method: 'POST',        
        body: formData
    });
    
    console.log(response);  
    toast('Image uploaded successfully!', 
    {
      hideProgressBar: false,
      autoClose: 1000,
      type: 'success'      
    });
}

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage(''); //Clear the previous error
  let errMsg=[];

  if (!data.brandTitle.trim()) {
    errMsg.push('Web title is required.');    
  }

  if (!data.brandTax.trim()) {
    errMsg.push('Tax rate is required.');    
  }

  if (!data.brandCurr.trim()) {
    errMsg.push('Currency is required.');    
  }

  if(errMsg.length>0){
    setErrorMessage(errMsg.join(' || '));
    return;
  }else
  {
  try
    {
      const result = await fetch (`${BASE_API_URL}/api/settings/${params.SettId}`, 
      {
        method:'PUT',
        body:JSON.stringify(
          {
            brandTitle:data.brandTitle, 
            brandTags:data.brandTags,
            brandTax:data.brandTax, 
            brandDisc: data.brandDisc,
            brandCurr:data.brandCurr, 
            brandIntro:data.brandIntro,
            brandLogo: data.brandLogo,
            brandIcon: data.brandIcon
          }),
      });
      const post = await result.json();
      console.log(post);
      setErrorMessage(''); //Clear the previous error
      {toast('Data saved successfully!', 
        {
          hideProgressBar: false,
          autoClose: 1000,
          type: 'success'
        });
        router.push(`/dashboard/settings/${params.SettId}`);
      }
      }catch(error) {
        console.log(error);
      }
    }
  }

  if(isLoading){
    return <div><Loading/></div>
  }
  
  return (
    <div>
      <div className='relative bg-gray-100 w-full rounded-lg shadow-lg p-9'>
        <div className='bg-amber-500 border-2 p-5 rounded-sm'>
          <h1 className='font-bold text-3xl text-white text-center '>SEO SETTINGS </h1>
        </div>
        <form className='py-3 px-2' encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className='flex flex-col mb-3 gap-2'>
            <label className='font-semibold uppercase'>Web Title:</label>
            <input type='text' name='brandTitle' value={data.brandTitle} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500  '></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label className='font-semibold uppercase'>Web Tags:</label>
            <input type='text' name='brandTags' value={data.brandTags} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500  '></input>
          </div>
          <div className='flex flex-col mb-3 gap-2'>
            <label className='font-semibold uppercase'>Web Intro:</label>
            <textarea type='text' name='brandIntro' value={data.brandIntro} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500' rows='4'></textarea>
          </div>
          <div className='grid md:grid-cols-3 mb-3 gap-2'>
            <div className='flex flex-col gap-1'>
              <label className='font-semibold uppercase'>TAX RATE:</label>
              <input type='number' name='brandTax' value={data.brandTax} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500 ' placeholder='In %'></input>
            </div>
            <div className='flex flex-col gap-1'>
              <label className='font-semibold uppercase'>Discount RATE:</label>
              <input type='number' name='brandDisc' value={data.brandDisc} onChange={handleChange} className='py-2 px-2 rounded-md border focus:outline-amber-500 ' placeholder='In %'></input>
            </div>
            <div className='flex flex-col gap-1'>
              <label className='font-semibold uppercase'>Currency:</label>
              <select type='select' name='webCurr' value={data.brandCurr} onChange={handleChange} className='py-2 px-2 font-bold rounded-md border focus:outline-amber-500  '>
                <option value='' className='text-center'>--- Select Currency ---</option>
                <option value='USD' className='font-bold text-sm'>USD - [$]</option>
                <option  value='INR' className='font-bold text-sm'>INR - [&#8377;]</option>
                <option value='GBP' className='font-bold text-sm'>GBP - [£]</option>
                <option value='EURO'className='font-bold text-sm'>EURO - [€]</option>
              </select>
            </div>
          </div>
          <div className='grid md:grid-cols-2 gap-1 w-full'>
            <div className='flex flex-col'>
              <label className='font-semibold uppercase'>Fevicon:</label>
              <div className='flex gap-1 mb-2'>
                <input type='file' className='cursor-pointer w-full py-1 bg-white px-1 rounded-md border' onChange={(e)=>handleImage("fvIcon", e)}></input>
                <button type='button' onClick={()=>handleImageUpload("fvIcon")} className='py-2 px-2 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>UPLOAD</button>
              </div>
              <div className='relative flex flex-col border-2 w-[40px] h-auto p-2 mb-2 bg-white rounded-md'>
                <Image alt="yes" src={imageFevIcon} className='rounded-sm'  width={20} height={20}/>
                <span className='absolute text-xs opacity-50 left-0 top-9'>[20*20]</span>
              </div>
            </div>
            <div className='flex flex-col'>
              <label className='font-semibold uppercase'>Brand Logo:</label>
              <div className='flex  gap-1 mb-2'>
                <input type='file' className='cursor-pointer py-1 bg-white w-full px-1 rounded-md border' onChange={(e)=>handleImage("brdLogo", e)}></input>
                <button type='button' onClick={()=>handleImageUpload("brdLogo")} className='py-2 px-2 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>UPLOAD</button>
              </div>
              <div className='relative flex flex-col border-2 w-[255px] h-[105px] mb-2 bg-white rounded-md'>
                <Image alt="yes" src={imageBrandLogo} className='rounded-sm mb-1'  width={250} height={100}/>
                <span className='text-xs opacity-50'>[Size: 250*100]</span>
              </div>
            </div>
          </div>
          <div className='my-3'>
            <button type='submit' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>UPDATE</button>
          </div>
          {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}