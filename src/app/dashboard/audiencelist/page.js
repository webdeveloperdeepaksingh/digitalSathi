'use client';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import React, { useEffect, useState } from 'react';
 
export default function AudienceList() {

  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
  const [aud, setAud] = useState([]);
  const [query, setQuery] = useState([]);

  useEffect(()=>{

    let api = '';
    if(query != ''){
      //get courses as per query entered.
      api = `http://localhost:3000/api/audience?userId=${loggedInUser.result._id}&query=${query}`
    }else{
      //get all courses.
      api = `http://localhost:3000/api/audience?userId=${loggedInUser.result._id}`
    }
    async function fetchData() {
      const res = await fetch(api);
      const audList = await res.json();
      setAud(audList);
      console.log(audList);
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[query])

  const handleSearch = (data) =>{
    setQuery(data);
    console.log(data);
  }

  return (
    <div>
       <div className="relative flex flex-col w-full shadow-lg rounded-lg">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' onKeyUp={(e)=> handleSearch(e.target.value)} className='p-2 w-[350px] focus:outline-amber-600' placeholder='Search guest name here...'></input>
        </div>
        <div>
          <button className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>ADD</button>
        </div>
      </div>
      <table className="table-auto w-full text-left">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>PARTICIPENT NAME</th>
            <th className='p-4'>EVENT NAME</th>
            <th className='p-4'>HOST NUMBER</th>
            <th className='p-4'>EMAIL ID</th>
            <th className='p-4'>PHONE NO.</th>
            <th className='p-4'>REGIS DATE</th>
            <th className='p-4'>ACTION</th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {
            aud.map((item)=> {
            return(
            <tr className='hover:bg-gray-100' key={item._id}>
              <td className='py-2 px-4'>{item.partName}</td>
              <td className='py-2 px-4'>{item.prodName}</td>
              <td className='py-2 px-4'>{item.hostContact}</td>
              <td className='py-2 px-4'>{item.partEmail}</td>
              <td className='py-2 px-4'>{item.partPhone}</td>
              <td className='py-2 px-4'>{item.createdAt}</td>
              <td className='flex py-2 text-lg gap-6  px-4'>
                <Link href={`/dashboard/audiencelist/${item._id}/deleteaudience`} ><RiDeleteBin5Fill /></Link>
              </td>
            </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
    </div>
  )
}
