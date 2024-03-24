'use client';
import Link from 'next/link';
import { BASE_API_URL } from '../../../../utils/constants';
import React, { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiVideoFill } from "react-icons/ri";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaShareSquare } from "react-icons/fa";
import Pagination from '@/components/Pagination/page';
import Loading from './loading';
import Cookies from 'js-cookie';

export default function CourseList() {

  const [isLoading, setIsLoading] = useState(true);
  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"), usrRole:Cookies.get("loggedInUserRole")}};
  const [course, setCourse] = useState([]);
  const [query, setQuery] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(()=>{

    let api = '';
    if(query != ''){
      //get courses as per query entered.
      api = `${BASE_API_URL}/api/courses?userId=${loggedInUser.result._id}&query=${query}`
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
      api = `${ BASE_API_URL }/api/courses?userId=${loggedInUser.result._id}&pageNbr=${page}`
    }
    async function fetchData() {
    try 
    {
      const res = await fetch(api , {cache: "no-store"});
      if(!res.ok){
        throw new Error('Error fetching course data');
      }
      const coList = await res.json();
      setCourse(coList.courseList);
      setTotalPages(coList.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }finally {
      setIsLoading(false); // Mark loading as complete
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
    <div className="relative flex flex-col w-full">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' onKeyUp={(e) => handleSearch(e.target.value)} className='py-2 px-3 max-w-[400px] focus:outline-amber-500' placeholder='Search course title...'></input>
        </div>
        <div>
          <Link href='/dashboard/course' className='py-3 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>ADD</Link>
        </div>
      </div>
      <table className="table-auto w-full text-left shadow-lg rounded-lg">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>COURSE TITLE</th>
            <th className='p-4'>CATEGORY</th>
            <th className='p-4'>INSTRUCTOR</th>
            <th className='p-4'>PRICE</th>
            <th className='p-4'>ACTION</th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {
            course.map((item)=> {
            return(
            <tr className='hover:bg-gray-100' key={item._id}>
              <td className='py-2 px-4'>{item.prodName}</td>
              <td className='py-2 px-4'>{item.prodCat}</td>
              <td className='py-2 px-4'>{item.prodAuth}</td>
              <td className='py-2 px-4'>{item.prodDisc}</td>
              <td className='flex py-2 text-lg gap-6  px-4'>
                <Link href={`/dashboard/course/${item._id}/updatecourse`}><FaEdit /></Link>
                <Link href={`/dashboard/watchcourse/${item._id}`}><RiVideoFill/></Link>
                <Link href={`/dashboard/course/${item._id}/deletecourse`} ><RiDeleteBin5Fill /></Link>
                {
                  loggedInUser.result.usrRole === "ADMIN" ? 
                  <Link href={`/dashboard/course/${item._id}/allowcourse`} ><FaShareSquare/></Link> 
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
