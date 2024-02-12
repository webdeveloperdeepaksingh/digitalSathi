'use client';
import TextEditor from '@/components/TinyMce/Editor';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRef } from 'react';
import Image from 'next/image';
import React from 'react';
 

export default function UpdateEvent({params}) {

    const inputRef = useRef();
    const router = useRouter();
    const [cat, setCat] = useState([]);
    const [image, setImage] = useState('');
    const [imageData, setImageData] = useState(null); 
    const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}}; 
    const [errorMessage, setErrorMessage] = useState(''); 
    const [editorContent, setEditorContent] = useState('');
    const [data, setData] = useState({prodName:'', prodTags:'',prodAuth:'', prodTax:'', prodDisct:'',  prodIntro:'', prodDesc:'', prodCat:'', prodPrice:'', prodDisc:'',  prodTime:'', prodDate:'', prodImage:'' })    
    
    useEffect(() =>{
      async function fetchCat() {
        let catdata = await fetch('http://localhost:3000/api/categories/?userId='+ loggedInUser.result._id);
        catdata = await catdata.json();
        setCat(catdata);
      }
      fetchCat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() =>{
        async function fetchData() {
          const eventData = await fetch(`http://localhost:3000/api/events/${params.EventId}`);
          const event = await eventData.json();
          setData(event.result);
          setEditorContent(event.result.prodDesc)
          setImage(`/images/${event.result.prodImage}`) 
        }
        fetchData();
    },[params.EventId]);

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
        data.prodImage=`evtImage_${params.EventId}.${imageData.name.split('.').pop()}`;
        formData.set('fileName', data.prodImage);
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
    
    if (!data.prodName.trim()) {
        errMsg.push('Event title is required.');    
    }
    if (!data.prodTax.trim()) {
        errMsg.push('Please enter tax rate.');    
    }
    if (!data.prodAuth.trim()) {
        errMsg.push('Please enter contact number.');    
    }   
    if (!data.prodCat.trim()) {
        errMsg.push('Please select event category.');    
    }

    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }

    try
    {
      const result = await fetch (`http://localhost:3000/api/events/${params.EventId}`, 
      {
        method:'PUT',
        body:JSON.stringify(
            {
                prodName:data.prodName, 
                prodTags:data.prodTags,  
                prodIntro:data.prodIntro,
                prodTax:data.prodTax,
                prodAuth: data.prodAuth,
                prodDisct:data.prodDisct, 
                prodDesc:data.prodDesc, 
                prodCat:data.prodCat, 
                prodPrice:data.prodPrice, 
                prodDisc:data.prodDisc, 
                prodImage: data.prodImage, 
                prodTime:data.prodTime, 
                prodDate:data.prodDate, 
            }),
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
        toast('Event updated successfully!', {
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
                    <div className='relative flex flex-col group bg-white  h-[260px] max-w-[800px] border border-solid rounded-md'>
                        <Image className='w-[100%] h-[100%]' alt='image' src={image} style={{ objectFit: 'cover' }} fill></Image>
                        <div className='hidden group-hover:block mx-auto mt-auto cursor-pointer  opacity-50 text-gray-300  text-4xl'>
                            <button type='button' onClick={showChooseFileBox} id='fileUpload'><FaCloudUploadAlt/></button>
                        </div>
                        <p className='text-sm mt-auto ml-auto  opacity-50'>Size:[260*800]</p>
                    </div>
                    <div className='flex flex-col'>
                        <div className='hidden border border-solid'>
                            <input type='file' id='fileUpload' ref={inputRef} accept='image/*' name='image' onChange={handleImage} ></input>
                        </div>
                        <div className='flex justify-center'>
                            <button type='button' onClick={handleImageUpload} className='w-full mt-3 py-2 px-2 rounded-md bg-white hover:bg-gray-50 text-amber-600 text-md font-bold border border-solid border-amber-600'>UPLOAD</button>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-3'> 
                    <div className='flex flex-col'>
                        <label>Event Title:*</label>
                        <input type='text' name='prodName' value={data.prodName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Event Tags:</label>
                        <input type='text' name='prodTags' value={data.prodTags} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Short Intro:</label>
                        <textarea type='text' name='prodIntro' value={data.prodIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600' rows='4'></textarea>
                    </div>
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='mb-3'>Event Description:</label>
                <TextEditor value={editorContent} handleEditorChange={handleEditorChange}/>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                    <div className='flex flex-col'>
                        <label>Original Price:</label>
                        <input type='text' name='prodPrice' value={data.prodPrice} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Discounted Price:</label>
                        <input type='text' name='prodDisc' value={data.prodDisc} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                <div className='flex flex-col'>
                    <label>Event Time:</label>
                    <input type='time' name='prodTime' value={data.prodTime} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Event Date:</label>
                    <input type='date' name='prodDate' value={data.prodDate} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                <div className='flex flex-col'>
                    <label>Tax Rate:*</label>
                    <input type='number' name='prodTax' value={data.prodTax} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Discount %:</label>
                    <input type='number' name='prodDisct' value={data.prodDisct} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                <div className='flex flex-col'>
                    <label>Event Category:*</label>
                    <select type='select' name='prodCat' value={data.prodCat} onChange={handleChange} className='py-2 font-bold px-2 mt-2 border rounded-md  focus:outline-amber-600'>
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
                    <label>Contact Number:*</label>
                    <input type='text' name='prodAuth' value={data.prodAuth} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
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

    
