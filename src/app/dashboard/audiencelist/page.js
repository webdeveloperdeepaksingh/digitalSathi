'use client';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import Loading from './loading';
import { BASE_API_URL } from '../../../../utils/constants';
import { BsCalendarEvent } from "react-icons/bs";
import Pagination from '@/components/Pagination/page';

 
export default function AudienceList() {

  const [isLoading, setIsLoading] = useState(true);
  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"), usrRole:Cookies.get("loggedInUserRole")}};
  const [aud, setAud] = useState([]);
  const [query, setQuery] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
 
  useEffect(()=>{
    let api = '';
    if(query != ''){
       api = `${BASE_API_URL}/api/audience?userId=${loggedInUser.result._id}&query=${query}`
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

      api = `${ BASE_API_URL }/api/audience?userId=${loggedInUser.result._id}&pageNbr=${page}`
    }
    async function fetchData() {
    try 
    {
      const res = await fetch(api , {cache: "no-store"});
      if(!res.ok){
        throw new Error('Error fetching course data');
      }
      const audList = await res.json();
      setAud(audList.posts);
      setTotalPages(audList.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }finally {
      setIsLoading(false); // Mark loading as complete
    } 
  }
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[query, currentPage])

  const handleSearch = (data) => {
    setQuery(data);
    console.log(data);
  };

  if (isLoading) {
    return <div><Loading/></div>; 
  }

  return (
    <div>
       <div className="relative flex flex-col w-full shadow-lg rounded-lg">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' onKeyUp={(e)=> handleSearch(e.target.value)} className='py-2 px-3 max-w-[400px] focus:outline-amber-500' placeholder='Search guest name...'></input>
        </div>
        <div>
          <button className='py-3 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>ADD</button>
        </div>
      </div>
      <table className="table-auto w-full text-left">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>GUEST NAME</th>
            <th className='p-4'>EMAIL ID</th>
            <th className='p-4'>PHONE NO.</th>
            <th className='p-4'>EVENT NAME</th>
            <th className='p-4'>REGIS DATE</th>
            <th className='p-4'>DETAILS</th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {
            aud?.map((item, index)=> {
              const dateString = item.createdAt;
              const dateObject = new Date(dateString);
              const localDateString = dateObject.toLocaleString();
            return(
            <>
            <tr className='hover:bg-gray-100' key={item._id}>
              <td className='py-2 px-4'>{item.custName}</td>
              <td className='py-2 px-4'>{item.custEmail}</td>
              <td className='py-2 px-4'>{item.custPhone}</td>
              <td className='py-2 px-4'>{item.prodName}</td>
              <td className='py-2 px-4'>{localDateString}</td>
              <td className='py-2 px-4'>
                 <Link href={`/dashboard/audiencelist/${item._id}/eventdetails`}><BsCalendarEvent/></Link>
              </td>
            </tr>
            </>
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
