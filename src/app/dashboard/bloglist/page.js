'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import Cookies from 'js-cookie';
import Loading from './loading';
import { RiDeleteBin5Fill } from "react-icons/ri";
import Pagination from '@/components/Pagination/page';
import { BASE_API_URL } from '../../../../utils/constants';

export default function BlogList() {

  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"), usrRole:Cookies.get("loggedInUserRole")}};
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState([]);
  const [blog, setBlog] = useState([]);

  useEffect(()=>{
    let api = '';
    if(query != ''){
       api = `${ BASE_API_URL }/api/blogs?userId=${loggedInUser.result._id}&query=${query}`
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

      api = `${ BASE_API_URL }/api/blogs?userId=${loggedInUser.result._id}&pageNbr=${page}`
    }
    async function fetchData() {
    try 
    {
      const res = await fetch(api);
      if (!res.ok) {
        throw new Error('Error fetching blog data');
      }
      const blogList = await res.json();
      setBlog(blogList.posts);
      setTotalPages(blogList.totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false); 
      }
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[query, currentPage])

  if (isLoading) {
    return <div><Loading/></div>; 
  }
   
  const handleSearch = (data) =>{
    setQuery(data);
    console.log(data);
  }

  return (
    <div>
      <div className="relative flex flex-col w-full shadow-lg rounded-lg">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' onKeyUp={(e)=> handleSearch(e.target.value)} className='p-2 w-[350px] focus:outline-amber-500' placeholder='Search blog title here...'></input>
        </div>
        <div>
          <Link href='/dashboard/blog' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>ADD</Link>
        </div>
      </div>
      <table className="table-auto w-full text-left">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>BLOG TITLE</th>
            <th className='p-4'>BLOG CATEGORY</th>
            <th className='p-4'>BLOG WRITER</th>
            <th className='p-4'>BLOG DATE</th>
            <th className='p-4'>ACTION</th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {
            blog?.map((item)=> {
              const dateString = item.createdAt;
              const dateObject = new Date(dateString);
              const localDateString = dateObject.toLocaleString();

            return(
            <tr className='hover:bg-gray-100' key={item._id} {...item}>
              <td className='py-2 px-4'>{item.blgName}</td>
              <td className='py-2 px-4'>{item.blgCat}</td>
              <td className='py-2 px-4'>{item.blgAuth}</td>
              <td className='py-2 px-4'>{localDateString}</td>
              <td className='flex py-2 text-lg gap-6  px-4'>
                <Link href={`/dashboard/blog/${item._id}`}><FaEdit /></Link>
                <Link href={`/dashboard/bloglist/${item._id}`} ><RiDeleteBin5Fill /></Link>
              </td>
            </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
    <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
  </div>
  )
}
