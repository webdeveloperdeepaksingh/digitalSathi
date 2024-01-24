'use client';
import TextEditor from '@/components/TinyMce/Editor';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import Image from 'next/image';
import React from 'react';
import { UserContext } from '@/context/UserContext';

export default function AddEvent() {

    const inputRef = useRef();
    const router = useRouter();
    const [image, setImage] = useState('');
    const [imageData, setImageData] = useState(null); 
    const [cat, setCat] = useState([]);  
    const {loggedInUser} = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState(''); 
    const [data, setData] = useState({evtName:'', evtTags:'', shortIntro:'', evtDesc:'', evtCat:'', origPrice:'', discPrice:'', evtPhone:'', evtPer:'', evtLoc:'', evtMod:'', evtTime:'', evtDate:'' })    
    
    useEffect(() =>{
      async function fetchData() {
        let catdata = await fetch('http://localhost:3000/api/categories/?userId='+ loggedInUser.result._id);
        catdata = await catdata.json();
        setCat(catdata);
      }
      fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

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
         const date = Date.now();      
         data.evtImage = `evtImage_${date}.${imageData.name.split('.').pop()}`;
         formData.set('fileName', data.evtImage);
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
        data.evtDesc= newContent;
        console.log(data.evtDesc);
    }
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); //Clear the previous error

    let errMsg=[];
    
    if (!data.evtName.trim()) {
        errMsg.push('Event title is required.');    
    }
    
    if (!data.evtCat.trim()) {
        errMsg.push('Please select event category.');    
    }

    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }

    try
    {
      const result = await fetch ('http://localhost:3000/api/events', 
      {
        method:'POST',
        body:JSON.stringify({evtName:data.evtName, evtTags:data.evtTags, shortIntro:data.shortIntro, evtDesc:data.evtDesc, evtCat:data.evtCat, origPrice:data.origPrice, discPrice:data.discPrice, evtPer:data.evtPer, evtLoc:data.evtLoc, evtMod:data.evtMod, evtPhone:data.evtPhone, evtTime:data.evtTime, evtDate:data.evtDate, userId: loggedInUser.result._id}),
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
        toast('Event created successfully!', {
        hideProgressBar: false,
        autoClose: 2000,
        type: 'success'
      });
      router.push('/dashboard/eventlist');
      }
    }catch(error) {
        console.log(error);
      }
  }
  return (
    <div>
      <div className='relative flex  bg-gray-100 justify-center  w-full p-6 shadow-lg rounded-lg'>
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
                        <label>Event Title:</label>
                        <input type='text' name='evtName' value={data.evtName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Event Tags:</label>
                        <input type='text' name='evtTags' value={data.evtTags} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Short Intro:</label>
                        <textarea type='text' name='shortIntro' value={data.shortIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600' rows='4'></textarea>
                    </div>
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='mb-3'>Event Description:</label>
                <TextEditor value={data.evtDesc} handleEditorChange={handleEditorChange}/>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                    <div className='flex flex-col'>
                        <label>Original Price:</label>
                        <input type='text' name='origPrice' value={data.origPrice} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Discounted Price:</label>
                        <input type='text' name='discPrice' value={data.discPrice} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                <div className='flex flex-col'>
                    <label>Contact Number:</label>
                    <input type='text' name='evtPhone' value={data.evtPhone} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Contact Person:</label>
                    <input type='text' name='evtPer' value={data.evtPer} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                <div className='flex flex-col'>
                    <label>Event Time:</label>
                    <input type='time' name='evtTime' value={data.evtTime} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Event Date:</label>
                    <input type='date' name='evtDate' value={data.evtDate} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                <div className='flex flex-col'>
                    <label>Event Category:</label>
                    <select type='select' name='evtCat' value={data.evtCat} onChange={handleChange} className='py-2 font-bold px-2 mt-2 border rounded-md  focus:outline-amber-600'>
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
                <div className='flex flex-col'>
                    <label>Event Mode:</label>
                    <select type='select' name='evtMod' value={data.evtMod} onChange={handleChange} className='py-2 px-2 mt-2 font-bold border rounded-md  focus:outline-amber-600'>
                        <option value='' className='text-center'>--- Choose Mode ---</option>
                        <option value='Online'>Online</option>
                        <option value='Offline'>Offline</option>
                    </select>
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label>Event Location:</label>
                <textarea type='text' name='evtLoc' value={data.evtLoc} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600' rows='4'></textarea>
            </div>
            <div className='mb-3'>
                <button type='submit' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>SAVE</button>
            </div>
            {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}

    
