'use client';
import TextEditor from '@/components/TinyMce/Editor';
import { BASE_API_URL } from '../../../../utils/constants';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Image from 'next/image';
import React from 'react';


export default function AddEvent() {

    const router = useRouter(); 
    const [cat, setCat] = useState([]);  
    const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
    const [errorMessage, setErrorMessage] = useState(''); 
    const [data, setData] = useState({prodName:'', prodTags:'', prodMeetLink:'', prodType:'', prodIntro:'', prodDesc:'', prodTax:'', prodDisct:'', prodCat:'', prodPrice:'', prodDisc:'',  prodTime:'', prodDate:'', prodAuth:'',prodCont:'', })    
    
    useEffect(() =>{
    async function fetchData() {
    try 
    {
        let catdata = await fetch(`${BASE_API_URL}/api/categories` , {cache: "no-store"});
        catdata = await catdata.json();
        setCat(catdata);
    } catch (error) {
        console.error("Error fetchind cat data: ", error);
    }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

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
        data.prodDesc= newContent;
    }
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); //Clear the previous error

    let errMsg=[];
    
    if (!data.prodName.trim()) {
        errMsg.push('Event title is required.');    
    }
    
    if (!data.prodCat.trim()) {
        errMsg.push('Please select event category.');    
    }

    if (!data.prodTax.trim()) {
        errMsg.push('Please enter tax rate.');    
    }

    if (!data.prodCont.trim()) {
        errMsg.push('Contact number is required.');    
    }

    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }

    try
    {
      const result = await fetch (`${BASE_API_URL}/api/events`, 
      {
        method:'POST',
        body:JSON.stringify(
        {
            prodName:data.prodName, 
            prodTags:data.prodTags, 
            prodType:"events",
            prodAuth:data.prodAuth,
            prodCont:data.prodCont, 
            prodIntro:data.prodIntro, 
            prodMeetLink:data.prodMeetLink,
            prodDesc:data.prodDesc, 
            prodCat:data.prodCat, 
            prodPrice:data.prodPrice, 
            prodDisc:data.prodDisc,
            prodTax:data.prodTax, 
            prodDisct:data.prodDisct,
            prodTime:data.prodTime, 
            prodDate:data.prodDate,
            userId: loggedInUser.result._id
        }),
      });

      const post = await result.json();
 
    if(post.success==false){    //This line of code needed for server-side validation only as written in USER Route API.
        if (Array.isArray(post.message)) {
            setErrorMessage(post.message.join(' || '));
            }else{
                setErrorMessage(post.message);
            }      
    }else{
        toast('Event created successfully!', {
        hideProgressBar: false,
        autoClose: 1000,
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
            <h1 className='uppercase'>Create Event</h1>
        </div>
        <form className='w-full' encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className='flex flex-col mb-3'>
                <label>Event Title:*</label>
                <input type='text' name='prodName' value={data.prodName} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
            </div>
            <div className='grid md:grid-cols-2 w-full mb-3 gap-1'>
                <div className='flex flex-col'>
                    <label>Event Tags:</label>
                    <input type='text' name='prodTags' value={data.prodTags} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Event Category:*</label>
                    <select type='select' name='prodCat' value={data.prodCat} onChange={handleChange} className='py-2 font-bold px-2 mt-2 border rounded-md  focus:outline-amber-500'>
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
            <div className='flex flex-col mb-3'>
                <label>Short Intro:</label>
                <textarea type='text' name='prodIntro' value={data.prodIntro} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500' rows='4'></textarea>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='mb-3'>Event Description:</label>
                <TextEditor value={data.prodDesc} handleEditorChange={handleEditorChange}/>
            </div>
            <div className='flex flex-col mb-3'>
                <label>Zoom Link:</label>
                <input type='text' name='prodMeetLink' value={data.prodMeetLink} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                <div className='flex flex-col mb-3'>
                    <label>Host Name:</label>
                    <input type='text' name='prodAuth' value={data.prodAuth} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
                <div className='flex flex-col mb-3'>
                    <label>Contact:</label>
                    <input type='text' name='prodCont' value={data.prodCont} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                    <div className='flex flex-col'>
                        <label>Original Price:</label>
                        <input type='text' name='prodPrice' value={data.prodPrice} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
                    <div className='flex flex-col'>
                        <label>Discounted Price:</label>
                        <input type='text' name='prodDisc' value={data.prodDisc} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                    </div>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                <div className='flex flex-col'>
                    <label>Event Time:</label>
                    <input type='time' name='prodTime' value={data.prodTime} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Event Date:</label>
                    <input type='date' name='prodDate' value={data.prodDate} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
            </div>
            <div className='grid md:grid-cols-2 mb-3 gap-2'> 
                <div className='flex flex-col'>
                    <label>Tax Rate %:*</label>
                    <input type='number' name='prodTax' value={data.prodTax} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
                </div>
                <div className='flex flex-col'>
                    <label>Discount %:</label>
                    <input type='number' name='prodDisct' value={data.prodDisct} onChange={handleChange} className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-500'></input>
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

    
