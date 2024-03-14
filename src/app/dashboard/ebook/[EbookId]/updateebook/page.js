'use client';
import TextEditor from '@/components/TinyMce/Editor';
import { BASE_API_URL } from '../../../../../../utils/constants';
import Loading from '../../loading';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Image from 'next/image';
import React from 'react';
 

export default function UpdateEbook({params}) {

    const router = useRouter();
    const [cat, setCat] = useState([]);
    const [image, setImage] = useState('');
    const [imageData, setImageData] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
    const [editorContent, setEditorContent] = useState(''); 
    const [errorMessage, setErrorMessage] = useState(''); 
    const [data, setData] = useState({prodName:'', prodTags:'', prodIntro:'',  prodTax:'', prodDisct:'', prodDesc:'', prodPrice:'', prodDisc:'', prodAuth:'', prodCat:'', prodImage:''})    

    useEffect(() =>{
    async function fetchData() {
    try 
    {
        let catdata = await fetch(`${BASE_API_URL}/api/categories/?userId=${loggedInUser.result._id}`);
        catdata = await catdata.json();
        setCat(catdata);
    } catch (error) {
        console.error("Error fetching category data: ",  error);
    }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    useEffect(() =>{
    async function fetchData() {
        try 
        {
            const res = await fetch(`${BASE_API_URL}/api/ebooks/${params.EbookId}`);
            if(!res.ok){
                throw new Error("Error fetching ebook data.");
            }
            const ebook = await res.json();
            setData(ebook.result);
            setEditorContent(ebook.result.prodDesc)
            setImage(`/images/${ebook.result?.prodImage}`)
         } catch (error) {
            console.error("Error fetching data: ", error);
        }finally{
            setIsLoading(false);
        }
    }
fetchData();
},[params.EbookId]);

    if(isLoading){
        return <div><Loading/></div>
    }

    const handleImage = (e) => {
        setImage(URL.createObjectURL(e.target.files?.[0]));
        setImageData(e.target.files?.[0])
        console.log(e.target.files?.[0]);
      };
    
    const handleImageUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', imageData); // Use 'append' instead of 'set'
        data.prodImage = `ebkImage_${params.EbookId}.${imageData.name.split('.').pop()}`;
        formData.append('fileName', data.prodImage); // Use 'append' here as well
     
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
        const imgName = data.prodImage;
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
    
    if (!data.prodName.trim()) {
        errMsg.push('Ebook title is required.');    
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
        const result = await fetch (`${BASE_API_URL}/api/ebooks/${params.EbookId}`, 
        {
          method:'PUT',
          body:JSON.stringify(
            {
                prodName:data.prodName,  
                prodTags:data.prodTags, 
                prodIntro:data.prodIntro,
                prodTax:data.prodTax,
                prodDisct:data.prodDisct, 
                prodDesc:data.prodDesc, 
                prodPrice:data.prodPrice, 
                prodDisc:data.prodDisc, 
                prodAuth:data.prodAuth, 
                prodCat:data.prodCat, 
                prodImage:data.prodImage, 
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
        }else
        {toast('Ebook updated successfully!', {
            hideProgressBar: false,
            autoClose: 1000,
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
      <div className='flex flex-col  bg-gray-100  justify-center  w-full p-9 shadow-lg rounded-lg'>
        <div className='px-3 py-3 text-center bg-white text-2xl font-bold rounded mb-3'>
            <h1 className='uppercase'>Update Ebook</h1>
        </div>
        <form className='w-full'encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='grid md:grid-cols-2 w-full mb-3 gap-6'>
                <div>
                    <div className='relative flex flex-col group  bg-white  h-auto w-auto border border-solid rounded-md'>
                        <Image  alt='image' src={image} width={583} height={600}></Image>
                        <p className='absolute hidden group-hover:block bg-white font-bold px-2 py-1 text-xs right-0 top-0'>Size:[583*918]</p>
                        <button type='button' onClick={handleRemoveImage} className='absolute hidden group-hover:block bg-white font-bold px-2 py-1 text-xs  left-0 bottom-0'>REMOVE</button>
                    </div>
                </div>
                <div className='flex flex-col gap-3'> 
                    <div className='flex flex-col'>
                        <label>Title:*</label>
                        <input type='text' name='prodName' value={data.prodName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Tags:</label>
                        <input type='text' name='prodTags' value={data.prodTags} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Author:</label>
                        <input type='text' name='prodAuth' value={data.prodAuth} onChange={handleChange} className='py-2 font-bold px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Original Price:</label>
                        <input type='text' name='prodPrice' value={data.prodPrice} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Discounted Price:</label>
                        <input type='text' name='prodDisc' value={data.prodDisc} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Tax Rate:</label>
                        <input type='number' name='prodTax' value={data.prodTax} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Discount %:</label>
                        <input type='number' name='prodDisct' value={data.prodDisct} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Category:*</label>
                        <select type='select' name='prodCat' value={data.prodCat} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'>
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
                        <textarea type='text' name='prodIntro' value={data.prodIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500' rows='4'></textarea>
                    </div>
                    <div className='flex flex-col'>
                        <label>Upload Image:</label>
                        <div className='flex gap-1 mt-2'>
                            <input type='file'  accept='image/*' name='image' onChange={handleImage} className='w-full py-2 px-2 border rounded-md bg-white focus:outline-amber-500' ></input>
                            <button type='button' onClick={handleImageUpload} className='py-1 px-2 rounded-md bg-white hover:bg-gray-50 text-amber-500 text-md font-bold border border-solid border-amber-500'>UPLOAD</button>
                        </div>
                    </div> 
                </div>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='mb-3'>Ebook Description:</label>
                <TextEditor value={editorContent} handleEditorChange={handleEditorChange}  />
            </div>
            <div className='my-3'>
                <button type='submit' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>SAVE</button>
            </div>
            {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        </form>
      </div>
    </div>
  )
}


    
