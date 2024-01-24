'use client';
import TextEditor from '@/components/TinyMce/Editor';
import { FaCloudUploadAlt } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import Image from 'next/image';
import React from 'react';
import { UserContext } from '@/context/UserContext';

export default function UpdateEbook({params}) {

    const inputRef = useRef();
    const router = useRouter();
    const [cat, setCat] = useState([]);
    const [image, setImage] = useState('');
    const [imageData, setImageData] = useState(null); 
    const {loggedInUser} = useContext(UserContext);
    const [editorContent, setEditorContent] = useState(''); 
    const [errorMessage, setErrorMessage] = useState(''); 
    const [data, setData] = useState({ebkName:'', ebkTags:'', ebkIntro:'', ebkDesc:'', ebkPrice:'', ebkDisc:'', ebkAuth:'', ebkCat:'', ebkImage:''})    

    useEffect(() =>{
        async function fetchData() {
          let catdata = await fetch('http://localhost:3000/api/categories/?userId='+ loggedInUser.result._id);
          catdata = await catdata.json();
          setCat(catdata);
        }
        fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[]);
    
    useEffect(() =>{
        async function fetchData() {
        const ebookData = await fetch(`http://localhost:3000/api/ebooks/${params.EbookId}`);
        const ebook = await ebookData.json();
        setData(ebook.result);
        setEditorContent(ebook.result.ebkDesc)
        setImage(`/images/${ebook.result.ebkImage}`) 
    }
fetchData();
},[params.EbookId]);

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
         data.ebkImage = `ebkImage_${params.EbookId}.${imageData.name.split('.').pop()}`;
         formData.set('fileName', data.ebkImage);
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
    
    if (!data.ebkName.trim()) {
        errMsg.push('Ebook title is required.');    
    }
    
    if (!data.ebkCat.trim()) {
        errMsg.push('Please select category.');    
    }

    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }
    try
      {
        const result = await fetch (`http://localhost:3000/api/ebooks/${params.EbookId}`, 
        {
          method:'PUT',
          body:JSON.stringify({ebkName:data.ebkName,  ebkTags:data.ebkTags, ebkIntro:data.ebkIntro, ebkDesc:editorContent, ebkPrice:data.ebkPrice, ebkDisc:data.ebkDisc, ebkAuth:data.ebkAuth, ebkCat:data.ebkCat, ebkImage:data.ebkImage}),
        });

        const post = await result.json();
        console.log(post);

        setErrorMessage(''); //Clear the previous error
        if(post.success==false){
            if (Array.isArray(post.message)) {
            setErrorMessage(post.message.join(' || '));
            }else{
            setErrorMessage(post.message);
            }      
        }else
        {toast('Ebook updated successfully!', {

                hideProgressBar: false,
                autoClose: 2000,
                type: 'success'

                });
            router.push(`/dashboard/ebook/${params.EbookId}/addchapters`);
        }
        }catch(error) {
          console.log(error);
        }
    }
  return (
    <div>
      <div className='relative flex  bg-gray-100  justify-center  w-full p-6 shadow-lg rounded-lg'>
        <form className='p-3 w-full'encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='grid md:grid-cols-2 w-full mb-3 gap-6'>
                <div>
                    <div className='flex items-center justify-center group bg-white relative h-[600px] max-w-[800px] border border-solid'>
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
                        <label>Title:*</label>
                        <input type='text' name='ebkName' value={data.ebkName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Tags:</label>
                        <input type='text' name='ebkTags' value={data.ebkTags} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Author:</label>
                        <input type='text' name='ebkAuth' value={data.ebkAuth} onChange={handleChange} className='py-2 font-bold px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Original Price:</label>
                        <input type='text' name='ebkPrice' value={data.ebkPrice} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Discounted Price:</label>
                        <input type='text' name='ebkDisc' value={data.ebkDisc} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Category:*</label>
                        <select type='select' name='ebkCat' value={data.ebkCat} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'>
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
                        <label>Short Intro:</label>
                        <textarea type='text' name='ebkIntro' value={data.ebkIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600' rows='4'></textarea>
                    </div>
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='mb-3'>Ebook Description:</label>
                <TextEditor value={editorContent} handleEditorChange={handleEditorChange}  />
            </div>
            <div className='my-3'>
                <button type='submit' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>SAVE</button>
            </div>
            {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}


    
