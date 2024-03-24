'use client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../../../../../utils/constants';
import Loading from '../loading';
import Image from 'next/image';

export default function SettingsPage({params}) {

  const [data, setData] = useState({brandTitle:'', brandTags:'', brandTax:'', brandDisc:'', brandCurr:'', brandIntro:'', brandLogo:'', brandIcon:'', brandBanner:''})
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [fevIcon, setFevIcon] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [brandBanner, setBrandBanner] = useState('');
  const router = useRouter();

  useEffect(() =>{
  async function fetchData() {
  try 
    {
      const res = await fetch(`${BASE_API_URL}/api/settings/${params.SettId}`, {cache: "no-store"});
      if(!res.ok){
        throw new Error("Error fetching settData,");
      }
      const settingData = await res.json();
      setData(settingData.result);
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
    setData((prev) =>{
    return {
        ...prev, [name]: value
    }
  }); 
  }

  const handleFevIconUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (!fevIcon) {
        alert('No image selected.');
    }else if (!fevIcon.type.startsWith('image/')) {
        alert('Only image files (JPEG, JPG, PNG ) are allowed.');
    }else if(fevIcon.size > 50000 ){   //in bytes
        alert('Image size exceeds the maximum allowed limit of 50KB.');
    }else{
        formData.append('file', fevIcon );
        formData.append('upload_preset', 'image_upload');
        formData.append('cloud_name', 'dlnjktcii');
        
        fetch('https://api.cloudinary.com/v1_1/dlnjktcii/image/upload', {
            method: 'POST',
            body: formData
        })
        .then((res) => res.json())
        .then((formData) => {
          data.brandIcon = formData.secure_url;      
          if(formData.secure_url){
              toast('Image uploaded successfully!', {
                  hideProgressBar: false,
                  autoClose: 1000,
                  type: 'success'      
              });
          }
          else{
              toast('Image upload failed...!', {
                  hideProgressBar: false,
                  autoClose: 1000,
                  type: 'error'      
              });
            }
        })
        .catch((err) => {
            console.error('Error uploading image:', err);
            toast('Image upload failed...!', {
                hideProgressBar: false,
                autoClose: 1000,
                type: 'error'      
            });
        });
      }   
    };

    const handleBrandLogoUpload = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      if (!brandLogo) {
          alert('No image selected.');
      }else if (!brandLogo.type.startsWith('image/')) {
          alert('Only image files (JPEG, JPG, PNG ) are allowed.');
      }else if(brandLogo.size > 50000 ){   //in bytes
          alert('Image size exceeds the maximum allowed limit of 50KB.');
      }else{
          formData.append('file', brandLogo );
          formData.append('upload_preset', 'image_upload');
          formData.append('cloud_name', 'dlnjktcii');
          
          fetch('https://api.cloudinary.com/v1_1/dlnjktcii/image/upload', {
              method: 'POST',
              body: formData
          })
          .then((res) => res.json())
          .then((formData) => {
            data.brandLogo = formData.secure_url;      
            if(formData.secure_url){
                toast('Image uploaded successfully!', {
                    hideProgressBar: false,
                    autoClose: 1000,
                    type: 'success'      
                });
            }
            else{
                toast('Image upload failed...!', {
                    hideProgressBar: false,
                    autoClose: 1000,
                    type: 'error'      
                });
              }
          })
          .catch((err) => {
              console.error('Error uploading image:', err);
              toast('Image upload failed...!', {
                  hideProgressBar: false,
                  autoClose: 1000,
                  type: 'error'      
              });
          });
        }   
      };

      const handleBrandBannerUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (!brandBanner) {
            alert('No image selected.');
        }else if (!brandBanner.type.startsWith('image/')) {
            alert('Only image files (JPEG, JPG, PNG ) are allowed.');
        }else if(brandBanner.size > 2097152 ){   //in bytes
            alert('Image size exceeds the maximum allowed limit of 2MB.');
        }else{
            formData.append('file', brandBanner );
            formData.append('upload_preset', 'image_upload');
            formData.append('cloud_name', 'dlnjktcii');
            
            fetch('https://api.cloudinary.com/v1_1/dlnjktcii/image/upload', {
                method: 'POST',
                body: formData
            })
            .then((res) => res.json())
            .then((formData) => {
              data.brandBanner = formData.secure_url;      
              if(formData.secure_url){
                  toast('Banner uploaded successfully!', {
                      hideProgressBar: false,
                      autoClose: 1000,
                      type: 'success'      
                  });
              }
              else{
                  toast('Banner upload failed...!', {
                      hideProgressBar: false,
                      autoClose: 1000,
                      type: 'error'      
                  });
                }
            })
            .catch((err) => {
                console.error('Error uploading Banner:', err);
                toast('Image upload failed...!', {
                    hideProgressBar: false,
                    autoClose: 1000,
                    type: 'error'      
                });
            });
          }   
        };

    const handleRemoveImage = async (imageUrl) => {
         
      if(imageUrl){
        const parts = imageUrl.split('/'); // Split the URL by slashes ('/')
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
                toast('Image removed successfully!', {
                    hideProgressBar: false,
                    autoClose: 1000,
                    type: 'success'      
                });
            }else{
                toast('Image remove failed...!', {
                    hideProgressBar: false,
                    autoClose: 1000,
                    type: 'error'      
                });
            }      
        } catch (error) {
            console.error('Error deleting image:', error);
        }
      }
    };

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
            brandIcon: data.brandIcon,
            brandBanner: data.brandBanner
          }),
      });
      const post = await result.json();
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
                <input type='file' className='cursor-pointer w-full py-1 bg-white px-1 rounded-md border' onChange={(e)=>setFevIcon(e.target.files[0])}></input>
                <button type='button' onClick={handleFevIconUpload} className='py-2 px-2 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>UPLOAD</button>
              </div>
              <div className='relative flex flex-col border-2 w-[40px] h-[40px] bg-white rounded-md'>
                  <div className='flex flex-col'>
                      <div className='w-[40px] h-[40px] mb-4 p-2'>
                        <Image alt="yes" src={data.brandIcon} className='rounded-sm'  width={40} height={40}/>
                      </div>
                      <div className='absolute h-2 -right-5 top-0'>
                        <button type='button' onClick={()=>handleRemoveImage(data.brandIcon)} className=' bg-gray-700 hover:bg-gray-600 text-white font-bold px-1 py-1 text-xs '>X</button>
                      </div>
                  </div>
                  <span className='absolute text-xs opacity-50 -left-0 top-10'>[20*20]</span>
              </div>
            </div>
            <div className='flex flex-col mt-3'>
              <label className='font-semibold uppercase'>Brand Logo:</label>
              <div className='flex  gap-1 mb-2'>
                <input type='file' className='cursor-pointer py-1 bg-white w-full px-1 rounded-md border' onChange={(e)=>setBrandLogo(e.target.files[0])}></input>
                <button type='button' onClick={handleBrandLogoUpload} className='py-2 px-2 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>UPLOAD</button>
              </div>
              <div className='relative flex flex-col border-2 w-[260px] h-[105px] mb-3 bg-white rounded-md'> 
                <Image alt="yes" src={data.brandLogo} className='rounded-sm mb-1'  width={250} height={100}/>
                <span className='text-xs opacity-50'>[Size: 250*100]</span>
                <div className='absolute h-2 right-1 top-1'>
                  <button type='button' onClick={()=>handleRemoveImage(data.brandLogo)} className=' bg-gray-700 hover:bg-gray-600 text-white font-bold px-1 py-1 text-xs '>X</button>
                </div>
              </div>
              <div className='flex flex-col mt-3'>
                <label className='font-semibold uppercase'>Brand Banner:</label>
                <div className='flex  gap-1 mb-2'>
                  <input type='file' className='cursor-pointer py-1 bg-white w-full px-1 rounded-md border' onChange={(e)=>setBrandBanner(e.target.files[0])}></input>
                  <button type='button' onClick={handleBrandBannerUpload} className='py-2 px-2 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>UPLOAD</button>
                </div>
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