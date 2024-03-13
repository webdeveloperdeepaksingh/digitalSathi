'use client';
import Link from 'next/link';
import { FaBook } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { LuBookOpen } from "react-icons/lu";
import { BASE_API_URL } from '../../../../utils/constants';
import Loading from './loading';

export default function MyEbooks() {

   const [isLoading, setIsLoading] = useState(true);
   const [ebook, setEbook] = useState([]);
   const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
   const [query, setQuery] = useState([]);
   

   useEffect(()=>{
 
     let api = '';
     if(query != ''){
       //get ebooks as per query entered.
       api = `${BASE_API_URL}/api/myebooks?userId=${loggedInUser.result._id}&query=${query}`
     }else{
      api = `${ BASE_API_URL }/api/myebooks?userId=${loggedInUser.result._id}`
    }
     async function fetchData() {
      try 
      {
        const res = await fetch(api);
        if(!res.ok){
          throw new Error("Error fetching ebook data.");
        }
        const ebookList = await res.json();
        setEbook(ebookList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }finally {
        setIsLoading(false); 
      }
    }
    fetchData();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[query])
  
   const handleSearch = (data) =>{
     setQuery(data);
     console.log(data);
   }

   if (isLoading) {
    return <div><Loading/></div>; // Show loading state
  }

  return (
    <div className="relative flex flex-col w-full ">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' onKeyUp={(e) => handleSearch(e.target.value)} className='py-2 px-3 max-w-[400px] focus:outline-amber-500' placeholder='Search ebook title...'></input>
        </div>
      </div>
      <table className="table-auto w-full text-left shadow-lg rounded-lg">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>EBOOK TITLE</th>
            <th className='p-4'>CATEGORY</th>
            <th className='p-4'>PRICE</th>
            <th className='p-4'>AUTHOR</th>
            <th className='p-4'>OPEN</th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {
            ebook.map((item)=> {
            return(
            <tr className='hover:bg-gray-100' key={item._id}>
              <td className='py-2 px-4 flex items-center'><FaBook className='mx-2' />{item.prodName}</td>
              <td className='py-2 px-4'>{item.prodCat}</td>
              <td className='py-2 px-4'>{item.prodDisc}</td>
              <td className='py-2 px-4'>{item.prodAuth}</td>
              <td className='flex py-2 text-lg gap-6  px-4'>
                <Link href={`/dashboard/ebooks/${item._id}`}><LuBookOpen/></Link>
              </td>
          </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}
