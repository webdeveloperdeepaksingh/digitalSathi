'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaEnvelope } from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function EnquiryList() {

  const [showAlert, setShowAlert] = useState(false);
  const [enq, setEnq] = useState([]);

  useEffect(() =>{
    async function fetchData() {
      let data = await fetch('http://localhost:3000/api/enquiries');
      data = await data.json();
      setEnq(data);
    }
    fetchData();
  },[])

  return (
    <div className="relative flex flex-col w-full shadow-lg rounded-lg">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' className='p-2 w-[350px]' placeholder='Search here...'></input>
        </div> 
      </div>
      <table className="table-auto w-full text-left">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>ENQUIRY PERSON</th>
            <th className='p-4'>ENQUIRY SUBJECT</th>
            <th className='p-4'>ENQUIRY EMAIL</th>
            <th className='p-4'>ENQUIRY DATE</th>
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
