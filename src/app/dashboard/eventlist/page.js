'use client';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function EventList() {

  const [event, setEvent] = useState([]);
  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
  const [query, setQuery] = useState([]);

  useEffect(()=>{

    let api = '';
    if(query != ''){
      //get courses as per query entered.
      api = `http://localhost:3000/api/events?userId=${loggedInUser.result._id}&query=${query}`
    }else{
      //get all courses.
      api = `http://localhost:3000/api/events?userId=${loggedInUser.result._id}`
    }
    async function fetchData() {
      const res = await fetch(api);
      const eventList = await res.json();
      setEvent(eventList);
      console.log(eventList);
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
          <input type='search' onKeyUp={(e) => handleSearch(e.target.value)} className='p-2 w-[350px] focus:outline-amber-600' placeholder='Search event title here...'></input>
        </div>
        <div>
          <Link href='/dashboard/event' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>ADD</Link>
        </div>
      </div>
      <table className="table-auto w-full text-left">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>EVENT TITLE</th>
            <th className='p-4'>CATEGORY</th>
            <th className='p-4'>PRICE</th>
            <th className='p-4'>DATE</th>
            <th className='p-4'>ACTION</th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {
            event?.map((item)=> {
            return(
            <tr className='hover:bg-gray-100' key={item._id}>
              <td className='py-2 px-4'>{item.prodName}</td>
              <td className='py-2 px-4'>{item.prodCat}</td>
              <td className='py-2 px-4'>{item.prodDisc}</td>
              <td className='py-2 px-4'>{item.prodDate}</td>
              <td className='flex py-2 text-lg gap-6  px-4'>
                <Link href={`/dashboard/event/${item._id}`}><FaEdit /></Link>
                <Link href={`/dashboard/eventlist/${item._id}`}  ><RiDeleteBin5Fill /></Link>
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
