'use client';
import Link from 'next/link';
import React, { useState, useEffect} from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Loading from './loading';
import { BASE_API_URL } from '../../../../utils/constants';
import Cookies from 'js-cookie';
import Pagination from '@/components/Pagination/page';

export default function CategoryList() {

   const [cat, setCat] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
   const [query, setQuery] = useState([]);
   const [currentPage, setCurrentPage] = useState(0);
   const [totalPages, setTotalPages] = useState(0);

   useEffect(()=>{
 
     let api = '';
     if(query != ''){
       //get category as per query entered.
       api = `${BASE_API_URL}/api/categories?query=${query}`
     }else{
      let page=0;
      if(totalPages === 0){
        page = currentPage + 1;
      }
      else {
        page = Math.min(currentPage + 1,  totalPages);
      }

      if(isNaN(page)){
        page=1;
      }
      api = `${ BASE_API_URL }/api/categories?pageNbr=${page}`
    }
    async function fetchData() {
    try 
      {
        const res = await fetch(api, {cache: "no-store"});
        if (!res.ok) {
          throw new Error('Error fetching category data');
        }
        const catList = await res.json();
        setCat(catList.posts);
        setTotalPages(catList.totalPages);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setIsLoading(false); 
      }
    }
    fetchData();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[query, currentPage])

   if (isLoading) {
    return <div><Loading/></div>; // Show loading state
  }
 
   const handleSearch = (data) =>{
     setQuery(data);
   }

  return (
    <div className="relative flex flex-col w-full shadow-lg rounded-lg">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' onKeyUp={(e)=> handleSearch(e.target.value)} className='py-2 px-3 max-w-[400px] focus:outline-amber-500' placeholder='Search category name...'></input>
        </div>
        <div>
          <Link href='/dashboard/category' className='py-3 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>ADD</Link>
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
      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}
