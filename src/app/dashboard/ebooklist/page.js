'use client';
import Link from 'next/link';
import { FaBook } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Cookies from 'js-cookie';
import Loading from './loading';
import { FaShareSquare } from "react-icons/fa";
import { LuBookOpen } from "react-icons/lu";
import { BASE_API_URL } from '../../../../utils/constants';
import Pagination from '@/components/Pagination/page';



export default function EbookList() {

   const [isLoading, setIsLoading] = useState(true);
   const [ebook, setEbook] = useState([]);
   const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"), usrRole:Cookies.get("loggedInUserRole")}};
   const [query, setQuery] = useState([]);
   const [currentPage, setCurrentPage] = useState(0);
   const [totalPages, setTotalPages] = useState(0);

   useEffect(()=>{
     let api = '';
     if(query != ''){
       //get ebooks as per query entered.
       api = `${BASE_API_URL}/api/ebooks?userId=${loggedInUser.result._id}&query=${query}`
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
      api = `${ BASE_API_URL }/api/ebooks?userId=${loggedInUser.result._id}&pageNbr=${page}`
    }
     async function fetchData() {
      try 
      {
        const res = await fetch(api);
        if(!res.ok){
          throw new Error("Error fetching ebook data.");
        }
        const ebookList = await res.json();
        setEbook(ebookList.ebookList);
        setTotalPages(ebookList.totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }finally {
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
     console.log(data);
   }

  return (
    <div className="relative flex flex-col w-full ">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' onKeyUp={(e) => handleSearch(e.target.value)} className='p-2 w-[350px] focus:outline-amber-600' placeholder='Search ebook title here...'></input>
        </div>
        <div>
          <Link href='/dashboard/ebook' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>ADD</Link>
        </div>
      </div>
      <table className="table-auto w-full text-left shadow-lg rounded-lg">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>EBOOK TITLE</th>
            <th className='p-4'>CATEGORY</th>
            <th className='p-4'>PRICE</th>
            <th className='p-4'>AUTHOR</th>
            <th className='p-4'>ACTION</th>
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
                <Link href={`/dashboard/ebook/${item._id}/updateebook`}><FaEdit /></Link>
                <Link href={`/dashboard/ebooks/${item._id}`}><LuBookOpen/></Link>
                <Link href={`/dashboard/ebook/${item._id}/deleteebook`}><RiDeleteBin5Fill /></Link>
                {
                  loggedInUser.result.usrRole === "ADMIN" ? 
                  <Link href={`/dashboard/ebook/${item._id}/allowebook`} ><FaShareSquare/></Link>
                  : null
                }
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
