'use client';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import React from 'react';
import Cookies from 'js-cookie';
import { BASE_API_URL } from "../../../../../../utils/constants";
import Loading from "../../loading";
import TextEditor from '@/components/TinyMce/Editor';
 
export default function UpdateCourse({params}) {
   
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [cat, setCat] = useState([]); 
    const [image, setImage] = useState('');
    const [imageBlobLink, setImageBlobLink] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
    const [data, setData] = useState({prodName:'', prodTags:'', prodIntro:'', prodAuth:'', prodTax:'', prodDisct:'', prodDesc:'', prodPrice:'', prodDisc:'', prodVal:'', prodCat:'', prodImage:''})    
    
    useEffect(() =>{
    async function fetchData() {
    try 
        {
            let catdata = await fetch(`${BASE_API_URL}/api/categories/?userId=`+ loggedInUser.result._id);
            catdata = await catdata.json();
            setCat(catdata);
        } catch (error) {
            console.error("Error fetching category data: ", error);
        }
    }
      fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() =>{
    async function fetchData() {  
    try 
        {
            const res = await fetch(`${BASE_API_URL}/api/courses/${params.CourseId}`, {cache:'no-store'});
            if(!res.ok){
                throw new Error("Error fetching course data.");
            }
            const course = await res.json();
            setData(course.result);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }finally{
            setIsLoading(false);
        }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[params.CourseId, image]); 

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
    }else if(image.size > 50000){   //in bytes
        alert('Image size exceeds the maximum allowed limit of 50KB.');
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
            data.prodImage = formData.secure_url;
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
        setData((prev) =>{
            return {
                ...prev, [name]: value
            }
        }); 
    }

    const handleEditorChange = (newContent) => {
        setEditorContent(newContent);
    }

    const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); //Clear the previous error
    let errMsg=[]; 
    if (!data.prodName.trim()) {
        errMsg.push('Course title is required.');    
    }  
    if (!data.prodCat.trim()) {
        errMsg.push('Please select category.');    
    }
    if (!data.prodTax.trim()) {
        errMsg.push('Please enter tax rate.');    
    }
    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }
    try
    {
      const result = await fetch (`${BASE_API_URL}/api/courses/${params.CourseId}`, 
      {
        method:'PUT',
        body:JSON.stringify(
            {
                prodName: data.prodName, 
                prodTags:data.prodTags, 
                prodIntro:data.prodIntro, 
                prodAuth: data.prodAuth,
                prodTax:data.prodTax, 
                prodDisct:data.prodDisct, 
                prodDesc:editorContent, 
                prodPrice:data.prodPrice, 
                prodDisc:data.prodDisc, 
                prodVal:data.prodVal, 
                prodCat:data.prodCat, 
                prodImage:data.prodImage
            }),
      });

      const post = await result.json();
      setErrorMessage(''); //Clear the previous error
        if(post.success==false){
            if (Array.isArray(post.message)) {
            setErrorMessage(post.message.join(' || '));
            }else{
            setErrorMessage(post.message);
            }      
        }else{
            toast('Course updated successfully!', {
                hideProgressBar: false,
                autoClose: 1000,
                type: 'success'
            });
            router.push(`/dashboard/course/${params.CourseId}/addchapter`);
        }    
    }catch(error) {
        console.log(error);
      }
  }

  if(isLoading){
    return <div><Loading/></div>
}

  return (
    <div>
       
      <div className='flex flex-col justify-center  bg-gray-100  w-full p-9 shadow-lg rounded-lg'>
        <div className='px-3 py-3 text-center bg-white text-2xl font-bold rounded mb-3'>
            <h1 className='uppercase'>Update Course</h1>
        </div>
        <form action="" className='w-full' encType="multipart/form-data"  onSubmit={handleSubmit}>
            <div className='grid md:grid-cols-2 w-full mb-3 gap-6'>
                <div className='relative flex flex-col group bg-white  h-auto w-full border border-solid rounded-md'>
                    <Image  alt={data.prodName} src={data.prodImage ? data.prodImage : imageBlobLink}  width={580} height={332} priority ></Image> 
                    <p className='absolute hidden group-hover:block bg-white font-bold px-2 py-1 text-xs right-0 top-0'>Size:[580*332]</p>
                    <button type='button' onClick={()=>handleRemoveImage(data.prodImage)} className='absolute hidden group-hover:block bg-white font-bold px-2 py-1 text-xs  left-0 bottom-0'>REMOVE</button>
                </div>    
                <div className='flex flex-col gap-3'> 
                    <div className='flex flex-col'>
                        <label>Course Title:</label>
                        <input type='text' name='prodName' value={data.prodName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Course Tags:</label>
                        <input type='text' name='prodTags' value={data.prodTags} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Course Instructor:</label>
                        <input type='text' name='prodAuth' value={data.prodAuth} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Upload Image:</label>
                        <div className='flex gap-1 mt-2'>
                            <input type='file'  accept='image/*' name='image' onChange={(e)=>handleImageChange(e.target.files[0])} className='w-full py-2 px-2 border rounded-md bg-white focus:outline-amber-500' ></input>
                            <button type='button' onClick={handleImageUpload} className='py-1 px-2 rounded-md bg-white hover:bg-gray-50 text-amber-500 text-md font-bold border border-solid border-amber-500'>UPLOAD</button>
                        </div>
                    </div> 
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label>Short Intro:</label>
                <textarea type='text' name='prodIntro' value={data.prodIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500' rows='4'></textarea>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='mb-2'>Course Description:</label>
                <TextEditor name='prodDesc' value={editorContent} handleEditorChange={handleEditorChange} initialValue={data.prodDesc}   />
             </div>
            <div className='grid md:grid-cols-2 mb-3 gap-3'> 
                <div className='flex flex-col'>
                    <label>Original Price:</label>
                    <input type='text' name='prodPrice' value={data.prodPrice} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Discounted Price:</label>
                    <input type='text' name='prodDisc' value={data.prodDisc} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-3'> 
                <div className='flex flex-col'>
                    <label>Tax Rate:</label>
                    <input type='number' name='prodTax' value={data.prodTax} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Discount %:</label>
                    <input type='number' name='prodDisct' value={data.prodDisct} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
            </div>
            <div className='grid md:grid-cols-2 mb-5 gap-3'> 
                <div className='flex flex-col'>
                    <label>Course Validity:</label>
                    <select type='select' name='prodVal' value={data.prodVal} onChange={handleChange} className='py-2 font-bold px-2 mt-2 border rounded-md  focus:outline-amber-500'>
                        <option value='' className='text-center'>--- Choose Validity ---</option>
                        <option value='lifeTime'>Lifetime</option>
                        <option value='days-360'>Days - 360</option>
                        <option value='days-180'>Days - 180</option>
                    </select>
                </div>
                <div className='flex flex-col'>
                    <label>Category:</label>
                    <select type='select' name='prodCat' value={data.prodCat} onChange={handleChange} className='py-2 px-2 mt-2 font-bold border rounded-md  focus:outline-amber-500'>
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
            </div>
            <button type='submit' className='py-2 px-3 mb-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>UPDATE & NEXT</button>
            {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}

    
