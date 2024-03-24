'use client';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { FaEnvelope } from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Loading from './loading';
import { BASE_API_URL } from '../../../../utils/constants';
import Pagination from '@/components/Pagination/page';


export default function EnquiryList() {

  const [isLoading, setIsLoading] = useState(true);
  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
  const [enq, setEnq] = useState([]);
  const [query, setQuery] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(()=>{

    let api = '';
    if(query != ''){
      //get courses as per query entered.
      api = `${ BASE_API_URL }/api/enquiries?userId=${loggedInUser.result._id}&query=${query}`
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
      api = `${ BASE_API_URL }/api/enquiries?userId=${loggedInUser.result._id}&pageNbr=${page}`
    }
    async function fetchData() {
    try 
    {
      const res = await fetch(api, {cache: "no-store"});
      if(!res.ok){
        throw new Error("Error fetching enquiry data.")
      }
      const enqList = await res.json();
      setEnq(enqList.posts);
      setTotalPages(enqList.totalPages);
    } catch (error) {
        console.error("Error fetching data.", error)
    }finally{
      setIsLoading(false);
    }
  }
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[query, currentPage])

  const handleSearch = (data) =>{
    setQuery(data);
  }

  if(isLoading){
    return <div><Loading/></div>
  }

  return (
    <div className="relative flex flex-col w-full">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' onKeyUp={(e) => handleSearch(e.target.vlaue)} className='py-2 px-3 max-w-[400px] focus:outline-amber-500' placeholder='Search enquirer name...'></input>
        </div> 
      </div>
      <table className="table-auto w-full text-left shadow-lg rounded-lg">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>ENQUIRY PERSON</th>
            <th className='p-4'>SUBJECT</th>
            <th className='p-4'>EMAIL</th>
            <th className='p-4'>PHONE</th>
            <th className='p-4'>DATE OF ENQUIRY</th>
            <th className='p-4'>ACTION</th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {
            enq.map((item)=> {
              const dateString = item.createdAt;
              const dateObject = new Date(dateString);
              const localDateString = dateObject.toLocaleString();
            return(
            <tr className='hover:bg-gray-100' key={item._id}>
              <td className='py-2 px-4'>{item.eqrPerson}</td>
              <td className='py-2 px-4'>{item.eqrSub}</td>
              <td className='py-2 px-4'>{item.eqrEmail}</td>
              <td className='py-2 px-4'>{item.eqrPhone}</td>
              <td className='py-2 px-4'>{localDateString}</td>
              <td className='flex py-2 text-lg gap-6  px-4'>
                <Link href={`/dashboard/enquirymsg/${item._id}`}><FaEnvelope /></Link>
                <Link href={`/dashboard/enquirylist/${item._id}`}><RiDeleteBin5Fill /></Link>
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
