'use client';
import Link from 'next/link';
import React, { useState, useEffect} from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Cookies from 'js-cookie';

export default function CategoryList() {

   const [cat, setCat] = useState([]);
   const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
   const [query, setQuery] = useState([]);

   useEffect(()=>{
 
     let api = '';
     if(query != ''){
       //get category as per query entered.
       api = `http://localhost:3000/api/categories?query=${query}`
     }else{
       //get all categories.
       api = `http://localhost:3000/api/categories`
     }
     async function fetchData() {
       const res = await fetch(api);
       const catList = await res.json();
       setCat(catList);
       console.log(catList);
     }
     fetchData();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[query])
 
   const handleSearch = (data) =>{
     setQuery(data);
     console.log(data);
   }

  return (
    <div className="relative flex flex-col w-full shadow-lg rounded-lg">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' onKeyUp={(e)=> handleSearch(e.target.value)} className='p-2 w-[350px] focus:outline-amber-600' placeholder='Search category name here...'></input>
        </div>
        <div>
          <Link href='/dashboard/category' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>ADD</Link>
        </div>
      </div>
      <table className="table-auto w-full text-left">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>CATEGORY</th>
            <th className='p-4'>ACTION</th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {
            cat.map((item)=> {
              return(
            <tr className='hover:bg-gray-100' key={item._id}>
              <td className='py-2 px-4'>{item.catName}</td>
              <td className='flex py-2 text-lg gap-6  px-4'>
                <Link href={`/dashboard/category/${item._id}`}><FaEdit /></Link>
                <Link href={`/dashboard/categorylist/${item._id}`}><RiDeleteBin5Fill /></Link>
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
