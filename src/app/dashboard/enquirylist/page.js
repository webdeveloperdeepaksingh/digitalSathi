'use client';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { FaEnvelope } from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";


export default function EnquiryList() {

  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
  const [enq, setEnq] = useState([]);
  const [query, setQuery] = useState([]);

  useEffect(()=>{

    let api = '';
    if(query != ''){
      //get courses as per query entered.
      api = `http://localhost:3000/api/enquiries?userId=${loggedInUser.result._id}&query=${query}`
    }else{
      //get all courses.
      api = `http://localhost:3000/api/enquiries?userId=${loggedInUser.result._id}`
    }
    async function fetchData() {
      const res = await fetch(api);
      const enqList = await res.json();
      setEnq(enqList);
      console.log(enqList);
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
          <input type='search' onKeyUp={(e) => handleSearch(e.target.vlaue)} className='p-2 w-[350px] focus:outline-amber-600' placeholder='Search enquirer name here...'></input>
        </div> 
      </div>
      <table className="table-auto w-full text-left">
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
            return(
            <tr className='hover:bg-gray-100' key={item._id}>
              <td className='py-2 px-4'>{item.eqrPerson}</td>
              <td className='py-2 px-4'>{item.eqrSub}</td>
              <td className='py-2 px-4'>{item.eqrEmail}</td>
              <td className='py-2 px-4'>{item.eqrPhone}</td>
              <td className='py-2 px-4'>{item.createdAt}</td>
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
    </div>
  )
}
