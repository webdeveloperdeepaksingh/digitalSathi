'use client';
import TextEditor from '@/components/TinyMce/Editor';
import Loading from '../loading';
import { BASE_API_URL } from '../../../../../utils/constants';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Image from 'next/image';
import React from 'react';


export default function UpdateBlog({params}) {

    const router = useRouter();
    const [cat, setCat] = useState([]);     
    const [image, setImage] = useState(''); 
    const [imageBlobLink, setImageBlobLink] = useState(''); 
    const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
    const [errorMessage, setErrorMessage] = useState(''); 
    const [editorContent, setEditorContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({blgName:'', blgTags:'', shortIntro:'', blgDesc:'', blgCat:'', blgAuth:'', blgImage:'' })    
    
    useEffect(() => {
    async function fetchData() {
        try {
        const response = await fetch(`${ BASE_API_URL }/api/categories` , {cache: "no-store"});
        if (!response.ok) {
            throw new Error('Error fetching category data');
        }
        const catData = await response.json();
        setCat(catData);
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
            const response = await fetch(`${ BASE_API_URL }/api/blogs/${params.BlogId}`, {cache:'no-store'});
            if (!response.ok) {
                throw new Error('Error fetching blog data');
            }
            const blgData = await response.json();                    
            setData(blgData.result);   
         } catch (error) {
            console.error('Error fetching data:', error);
        }finally {
            setIsLoading(false); // Mark loading as complete
        }               
    }
    fetchData();        
    },[params.BlogId, image]);

    if (isLoading) {
        return <div><Loading/></div>; // Show loading state
      }    

    const handleImageChange = async (imgFile) => {
        if(imgFile){
            setImage(imgFile);
            setImageBlobLink(URL.createObjectURL(imgFile));
        }
    }

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        if (!image) {
            alert('No image selected.');
        }else if (!image.type.startsWith('image/')) {
            alert('Only image files (JPEG, JPG, PNG ) are allowed.');
        }else if(image.size > 100000){   //in bytes
            alert('Image size exceeds the maximum allowed limit of 100KB.');
        }else{
            formData.append('file', image);
            formData.append('upload_preset', 'image_upload');
            formData.append('cloud_name', 'dlnjktcii');
            
            fetch('https://api.cloudinary.com/v1_1/dlnjktcii/image/upload', {
                method: 'POST',
                body: formData
            })
            .then((res) => res.json())
            .then((formData) => {
                data.blgImage = formData.secure_url;
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
      <div className='flex flex-col  bg-gray-100 justify-center w-full p-9 shadow-lg rounded-lg'>
        <div className='px-3 py-3 text-center bg-white text-2xl font-bold rounded mb-3'>
            <h1 className='uppercase'>Update Blog</h1>
        </div>
        <form className=' w-full' encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='grid md:grid-cols-1 w-full mb-3 gap-6'>
                <div>
                    <div className='relative flex flex-col group bg-white  h-auto w-full border border-solid rounded-md mb-3'>
                        <Image  alt='image' src={data.blgImage ? data.blgImage : imageBlobLink } height={400} width={1500}></Image>
                        <p className='absolute hidden group-hover:block bg-white font-bold px-2 py-1 text-xs right-0 top-0'>Size:[400*1500]</p>
                        <button type='button' onClick={handleRemoveImage} className='absolute hidden group-hover:block bg-white font-bold px-2 py-1 text-xs  left-0 bottom-0'>REMOVE</button>
                    </div>
                    <div className='flex flex-col'>
                        <label>Upload Image:</label>
                        <div className='flex gap-1 mt-2'>
                            <input type='file'  accept='image/*' name='image' onChange={(e)=>handleImageChange(e.target.files[0])} className='w-full py-2 px-2 border rounded-md bg-white focus:outline-amber-500' ></input>
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
                <TextEditor initialValue={data.blgDesc} value={editorContent} handleEditorChange={handleEditorChange}/>
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
