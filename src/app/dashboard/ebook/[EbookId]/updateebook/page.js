'use client';
import TextEditor from '@/components/TinyMce/Editor';
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
    const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
    const [editorContent, setEditorContent] = useState(''); 
    const [errorMessage, setErrorMessage] = useState(''); 
    const [data, setData] = useState({prodName:'', prodTags:'', prodIntro:'',  prodTax:'', prodDisct:'', prodDesc:'', prodPrice:'', prodDisc:'', prodAuth:'', prodCat:'', prodImage:''})    

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
        setEditorContent(ebook.result.prodDesc)
        setImage(`/images/${ebook.result.prodImage}`) 
    }
fetchData();
},[params.EbookId]);

    const handleImage = (e) => {
        setImage(URL.createObjectURL(e.target.files?.[0]));
        setImageData(e.target.files?.[0])
        console.log(e.target.files?.[0]);
      };
    
      const handleImageUpload = async (e) =>{
        e.preventDefault();
         const formData = new FormData();
         formData.set('image', imageData);  
         data.prodImage = `ebkImage_${params.EbookId}.${imageData.name.split('.').pop()}`;
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
        const result = await fetch (`http://localhost:3000/api/ebooks/${params.EbookId}`, 
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
                    <div className='relative flex flex-col group bg-white  h-[918px] w-[583px] border border-solid rounded-md'>
                        <Image  alt='image' src={image} width={583} height={918}></Image>
                        <p className='absolute text-sm right-2 bottom-2'>Size:[583*918]</p>
                    </div>
                </div>
                <div className='flex flex-col gap-3'> 
                    <div className='flex flex-col'>
                        <label>Title:*</label>
                        <input type='text' name='prodName' value={data.prodName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Tags:</label>
                        <input type='text' name='prodTags' value={data.prodTags} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Author:</label>
                        <input type='text' name='prodAuth' value={data.prodAuth} onChange={handleChange} className='py-2 font-bold px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Original Price:</label>
                        <input type='text' name='prodPrice' value={data.prodPrice} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Discounted Price:</label>
                        <input type='text' name='prodDisc' value={data.prodDisc} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Tax Rate:</label>
                        <input type='number' name='prodTax' value={data.prodTax} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Discount %:</label>
                        <input type='number' name='prodDisct' value={data.prodDisct} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Category:*</label>
                        <select type='select' name='prodCat' value={data.prodCat} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'>
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
                        <textarea type='text' name='prodIntro' value={data.prodIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600' rows='4'></textarea>
                    </div>
                    <div className='flex flex-col'>
                        <label>Upload Image:</label>
                        <div className='flex gap-1 mt-2'>
                            <input type='file'  accept='image/*' name='image' onChange={handleImage} className='w-full py-2 px-2 border rounded-md bg-white focus:outline-amber-600' ></input>
                            <button type='button' onClick={handleImageUpload} className='py-1 px-2 rounded-md bg-white hover:bg-gray-50 text-amber-600 text-md font-bold border border-solid border-amber-600'>UPLOAD</button>
                        </div>
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


    
