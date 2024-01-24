'use client';
import Link from 'next/link';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/UserContext';

export default function AudienceList() {

  const [aud, setAud] = useState([]);
  const {loggedInUser} = useContext(UserContext);

  useEffect(() =>{
    async function fetchData(){
      const res = await fetch('http://localhost:3000/api/audience/?userId='+ loggedInUser.result._id)
      const audList = await res.json();
      setAud(audList);
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div>
       <div className="relative flex flex-col w-full shadow-lg rounded-lg">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' className='p-2 w-[350px]' placeholder='Search here...'></input>
        </div>
        <div>
          <button className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>ADD</button>
        </div>
      </div>
      <table className="table-auto w-full text-left">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>GUEST NAME</th>
            <th className='p-4'>EVENT NAME</th>
            <th className='p-4'>EMAIL ID</th>
            <th className='p-4'>PHONE NO.</th>
            <th className='p-4'>PAYMENT</th>
            <th className='p-4'>REGIS DATE</th>
            <th className='p-4'>ACTION</th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {
            aud.map((item)=> {
            return(
            <tr className='hover:bg-gray-100' key={item._id}>
              <td className='py-2 px-4'>{item.audName}</td>
              <td className='py-2 px-4'>{item.evtName}</td>
              <td className='py-2 px-4'>{item.audEmail}</td>
              <td className='py-2 px-4'>{item.audPhone}</td>
              <td className='py-2 px-4'>{item.audPay}</td>
              <td className='py-2 px-4'>{item.createdAt}</td>
              <td className='flex py-2 text-lg gap-6  px-4'>
                <Link href={`/dashboard/audiencelist/${item._id}`} ><RiDeleteBin5Fill /></Link>
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
