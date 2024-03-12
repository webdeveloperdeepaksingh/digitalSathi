'use client';
import TextEditor from '@/components/TinyMce/Editor';
import { BASE_API_URL } from '../../../../utils/constants';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import React from 'react';
 
export default function AddEbook() {

    const router = useRouter();
    const [cat, setCat] = useState([]);  
    const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"), usrRole:Cookies.get("loggedInUserRole")}};
    const [errorMessage, setErrorMessage] = useState(''); 
    const [data, setData] = useState({prodName:'', prodTags:'', prodIntro:'', prodType:'', prodTax:'', prodDisct:'', prodDesc:'', prodPrice:'', prodDisc:'', prodAuth:'', prodCat:'', prodImage:'', userId:''})    

    useEffect(() =>{
        async function fetchData() {
          let catdata = await fetch(`${BASE_API_URL}/api/categories`);
          catdata = await catdata.json();
          setCat(catdata);
        }
        fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[]);
  
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
          data.prodDesc= newContent;
          console.log(data.prodDesc);
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
        const result = await fetch (`${BASE_API_URL}/api/ebooks`, 
        {
          method:'POST',
          body:JSON.stringify(
            {
                prodName:data.prodName,  
                prodTags:data.prodTags, 
                prodIntro:data.prodIntro,
                prodType:"ebooks",
                prodTax:data.prodTax,
                prodDisct:data.prodDisct, 
                prodDesc:data.prodDesc, 
                prodPrice:data.prodPrice, 
                prodDisc:data.prodDisc, 
                prodAuth:data.prodAuth, 
                prodCat:data.prodCat,  
                userId: loggedInUser.result._id
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
        {toast('Ebook added successfully!', 
            {
                hideProgressBar: false,
                autoClose: 1000,
                type: 'success'
            });
            router.push('/dashboard/ebooklist');
        }
        }catch(error) {
          console.log(error);
        }
    }
  return (
    <div>
      <div className='relative flex  bg-gray-100  justify-center  w-full p-9 shadow-lg rounded-lg'>
        <form className='p-3 w-full'encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='flex flex-col mb-3'>
                <label>Title:*</label>
                <input type='text' name='prodName' value={data.prodName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
            </div>
            <div className='grid md:grid-cols-3 w-full mb-3 gap-1'>
                <div className='flex flex-col'>
                    <label>Tags:</label>
                    <input type='text' name='prodTags' value={data.prodTags} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
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
                    <label>Author:</label>
                    <input type='text' name='prodAuth' value={data.prodAuth} onChange={handleChange} className='py-2 font-bold px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
            </div>
            <div className='grid md:grid-cols-2 w-full mb-3 gap-1'>
                <div className='flex flex-col'>
                    <label>Original Price:</label>
                    <input type='text' name='prodPrice' value={data.prodPrice} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Discounted Price:</label>
                    <input type='text' name='prodDisc' value={data.prodDisc} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
             </div> 
             <div className='grid md:grid-cols-2 w-full mb-3 gap-1'>        
                <div className='flex flex-col'>
                    <label>Tax Rate %:</label>
                    <input type='number' name='prodTax' value={data.prodTax} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Discount %:</label>
                    <input type='number' name='prodDisct' value={data.prodDisct} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div> 
            </div>   
            <div className='flex flex-col mb-3'>
                <label>Short Intro:</label>
                <textarea type='text' name='prodIntro' value={data.prodIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500' rows='4'></textarea>
            </div>     
            <div className='flex flex-col mb-3'>
                <label className='mb-3'>Ebook Description:</label>
                <TextEditor value={data.prodDesc} handleEditorChange={handleEditorChange}  />
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


    
