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
 

export default function UpdateEvent({params}) {

    const router = useRouter();
    const [cat, setCat] = useState([]);
    const [image, setImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}}; 
    const [errorMessage, setErrorMessage] = useState(''); 
    const [editorContent, setEditorContent] = useState('');
    const [data, setData] = useState({prodName:'', prodTags:'', prodMeetLink:'', prodAuth:'', prodCont:'', prodTax:'', prodDisct:'',  prodIntro:'', prodDesc:'', prodCat:'', prodPrice:'', prodDisc:'',  prodTime:'', prodDate:'', prodImage:'' })    
    
    useEffect(() =>{
    async function fetchCat() {
    try 
    {
        let catdata = await fetch(`${BASE_API_URL}/api/categories/?userId=${loggedInUser.result._id}`);
        catdata = await catdata.json();
        setCat(catdata);        
    } catch (error) {
        console.error("Error fetching cat data: ", error);
    }
    }
    fetchCat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() =>{
    async function fetchData() {
    try 
        {
            const res = await fetch(`${BASE_API_URL}/api/events/${params.EventId}`);
            if(!res.ok){
                throw new Error("Error fetching event data.");
            }
            const event = await res.json();
            setData(event.result);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally{
            setIsLoading(false);
        }
    }
    fetchData();
    },[params.EventId, image]);

    if(isLoading){
        return <div><Loading/></div>
    }

    const handleImageChange = async (imgFile) => {
        setImage(imgFile);
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
      const result = await fetch (`${BASE_API_URL}/api/events/${params.EventId}`, 
      {
        method:'PUT',
        body:JSON.stringify(
            {
                prodName:data.prodName, 
                prodTags:data.prodTags, 
                prodMeetLink: data.prodMeetLink, 
                prodIntro:data.prodIntro,
                prodTax:data.prodTax,
                prodAuth: data.prodAuth,
                prodDisct:data.prodDisct, 
                prodDesc:data.prodDesc, 
                prodCat:data.prodCat, 
                prodCont:data.prodCont, 
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
      <div className='flex flex-col  bg-gray-100 justify-center  w-full p-9 shadow-lg rounded-lg'>
        <div className='px-3 py-3 text-center bg-white text-2xl font-bold rounded mb-3'>
            <h1 className='uppercase'>Update Event</h1>
        </div>
        <form className='w-full' encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='grid md:grid-cols-2 w-full mb-3 gap-6'>
                <div className='relative flex flex-col group bg-white h-auto w-full border border-solid rounded-md'>
                    <Image alt={data.prodName} src={data.prodImage} width={580} height={332} ></Image>
                    <p className='absolute hidden group-hover:block bg-white font-bold px-2 py-1 text-xs right-0 top-0'>Size:[580*332]</p>
                    <button type='button' onClick={handleRemoveImage} className='absolute hidden group-hover:block bg-white font-bold px-2 py-1 text-xs  left-0 bottom-0'>REMOVE</button>
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
                        <label>Upload Image:</label>
                        <div className='flex gap-1 mt-2'>
                            <input type='file'  accept='image/*' name='image' onChange={(e)=>handleImageChange(e.target.files[0])} className='w-full py-2 px-2 border rounded-md bg-white focus:outline-amber-600' ></input>
                            <button type='button' onClick={handleImageUpload} className='py-1 px-2 rounded-md bg-white hover:bg-gray-50 text-amber-600 text-md font-bold border border-solid border-amber-600'>UPLOAD</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label>Short Intro:</label>
                <textarea type='text' name='prodIntro' value={data.prodIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600' rows='4'></textarea>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='mb-3'>Event Description:</label>
                <TextEditor value={editorContent} handleEditorChange={handleEditorChange} initialValue={data.prodDesc}/>
            </div>
            <div className='flex flex-col mb-3'>
                <label>Zoom Link:</label>
                <input type='text' name='prodMeetLink' value={data.prodMeetLink} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                <div className='flex flex-col mb-3'>
                    <label>Host Name:</label>
                    <input type='text' name='prodAuth' value={data.prodAuth} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
                <div className='flex flex-col mb-3'>
                    <label>Contact:</label>
                    <input type='text' name='prodCont' value={data.prodCont} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                </div>
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
            <div className='mb-3'>
                <button type='submit' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>UPDATE</button>
            </div>
            {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}

    
