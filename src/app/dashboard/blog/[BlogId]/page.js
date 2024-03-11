'use client';
import TextEditor from '@/components/TinyMce/Editor';
import Loading from '../loading';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { BASE_API_URL } from '../../../../../utils/constants';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRef } from 'react';
import Image from 'next/image';
import React from 'react';


export default function UpdateBlog({params}) {

    const inputRef = useRef();
    const router = useRouter();
    const [cat, setCat] = useState([]);     
    const [image, setImage] = useState(''); 
    const [imageData, setImageData] = useState(null); 
    const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
    const [errorMessage, setErrorMessage] = useState(''); 
    const [editorContent, setEditorContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({blgName:'', blgTags:'', shortIntro:'', blgDesc:'', blgCat:'', blgAuth:'', blgImage:'' })    
    
    useEffect(() => {
        async function fetchData() {
          try {
            const response = await fetch(`${ BASE_API_URL }/api/categories`);
            if (!response.ok) {
              throw new Error('Error fetching category data');
            }
            const catData = await response.json();
            setCat(catData.posts);
          } catch (error) {
            console.error('Error fetching data:', error);
          } 
        }
        fetchData();
      }, []);

    useEffect(() =>{
        async function fetchData() {
        try 
        {
            const response = await fetch(`${ BASE_API_URL }/api/blogs/${params.BlogId}`);
            if (!response.ok) {
                throw new Error('Error fetching blog data');
            }
            const blgData = await response.json();                    
            setData(blgData.result);   
            setEditorContent(blgData.result.blgDesc);   
            setImage(`/images/${blgData.result.blgImage}`);
         } catch (error) {
            console.error('Error fetching data:', error);
        }finally {
            setIsLoading(false); // Mark loading as complete
          }               
    }
    fetchData();        
    },[params.BlogId]);

    if (isLoading) {
        return <div><Loading/></div>; // Show loading state
      }    

    const showChooseFileBox = () =>{
        inputRef.current.click();
    };

    const handleImage = (e) => {
        setImage(URL.createObjectURL(e.target.files?.[0]));        
        setImageData(e.target.files?.[0])
        console.log(e.target.files?.[0]);
      };
    
      const handleImageUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', imageData); // Use 'append' instead of 'set'
        data.blgImage = `blgImage_${params.BlogId}.${imageData.name.split('.').pop()}`;
        formData.append('fileName', data.blgImage); // Use 'append' here as well
     
        try {
            const response = await fetch(`${BASE_API_URL}/api/imagefiles`, {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                console.log('Image uploaded successfully!');
                toast('Image uploaded successfully!', {
                    hideProgressBar: false,
                    autoClose: 1000,
                    type: 'success'      
                });        
            } else {
                console.error('Image upload failed:', response.status);
                toast('Image upload failed!', {
                    hideProgressBar: false,
                    autoClose: 1000,
                    type: 'error'      
                }); 
            }
        } catch (error) {
            console.error('Error during image upload:', error);
        }
    };

    const handleRemoveImage = async (e) => {
    e.preventDefault();
    try 
        {
            const imgName = data.blgImage;
            const response = await fetch(`${BASE_API_URL}/api/removeimagefiles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imgName }), // Send the file name to delete
            });
    
            const dataImg = await response.json();
            if (response.ok) {
                    toast('Image removed successfully!', {
                    hideProgressBar: false,
                    autoClose: 1000,
                    type: 'success'      
                });        
            } else {
                    toast('Image remove failed!', {
                    hideProgressBar: false,
                    autoClose: 1000,
                    type: 'error'      
                }); 
            }
        } catch (error) {
            console.error('Error removing image:', error);
        }
    };

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
    
    if (!data.blgName.trim()) {
        errMsg.push('Blog title is required.');    
    }
    
    if (!data.blgCat.trim()) {
        errMsg.push('Please select category.');    
    }

    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }

    try
    {
      const result = await fetch (`${ BASE_API_URL }/api/blogs/${params.BlogId}`, 
      {
        method:'PUT',
        body:JSON.stringify
        (
            {
                blgName:data.blgName, 
                blgTags:data.blgTags, 
                shortIntro:data.shortIntro, 
                blgDesc:editorContent, 
                blgCat:data.blgCat, 
                blgAuth:data.blgAuth, 
                blgImage:data.blgImage, 
                userId:loggedInUser.result?._id
            }
        ),
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
        toast('Blog updated successfully!', 
        {
            hideProgressBar: false,
            autoClose: 1000,
            type: 'success'
        });
        router.push('/dashboard/bloglist');
        }
    }catch(error) {
        console.log(error);
      }
  }
  return (
    <div>
      <div className='relative flex  bg-gray-100 justify-center w-full p-6 shadow-lg rounded-lg'>
        <form className='p-3 w-full' encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='grid md:grid-cols-1 w-full mb-3 gap-6'>
                <div>
                    <div className='relative flex flex-col group bg-white  h-auto w-full border border-solid rounded-md mb-3'>
                        <Image  alt='image' src={image} height={400} width={1500}></Image>
                        <p className='absolute hidden group-hover:block bg-white font-bold px-2 py-1 text-xs right-0 top-0'>Size:[400*1500]</p>
                        <button type='button' onClick={handleRemoveImage} className='absolute hidden group-hover:block bg-white font-bold px-2 py-1 text-xs  left-0 bottom-0'>REMOVE</button>
                    </div>
                    <div className='flex flex-col'>
                        <label>Upload Image:</label>
                        <div className='flex gap-1 mt-2'>
                            <input type='file'  accept='image/*' name='image' onChange={handleImage} className='w-full py-2 px-2 border rounded-md bg-white focus:outline-amber-500' ></input>
                            <button type='button' onClick={handleImageUpload} className='py-1 px-2 rounded-md bg-white hover:bg-gray-50 text-amber-500 text-md font-bold border border-solid border-amber-500'>UPLOAD</button>
                        </div>
                    </div> 
                </div>
                <div className='flex flex-col gap-3'> 
                    <div className='flex flex-col'>
                        <label>Blog Title:</label>
                        <input type='text' name='blgName' value={data.blgName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Blog Tags:</label>
                        <input type='text' name='blgTags' value={data.blgTags} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Short Intro:</label>
                        <textarea type='text' name='shortIntro' value={data.shortIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500' rows='4'></textarea>
                    </div>
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='mb-3'>Blog Description:</label>
                <TextEditor value={data.blgDesc} handleEditorChange={handleEditorChange}/>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                <div className='flex flex-col'>
                    <label>Blog Author:</label>
                    <input type='text' name='blgAuth' value={data.blgAuth} onChange={handleChange} className='py-2 font-bold px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Category:</label> 
                    <select type='select'name='blgCat' value={data.blgCat} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'>
                    <option value='' className='text-center'>--- Choose Category ---</option>
                        {
                            cat?.map((item) => {
                                return(
                                    <option value={item.catName} key={item._id}>{item.catName}</option>
                                )
                            })
                        }
                    </select>
                </div>
            </div>
            <div className='mb-3'>
                <button type='submit' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>SAVE</button>
            </div>
            {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}
