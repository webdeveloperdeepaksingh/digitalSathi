'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function UserList() {

  const [showAlert, setShowAlert] = useState(false);
  const [user, setUser] = useState([]);

  useEffect(() =>{
    async function fetchData() {
      let data = await fetch('http://localhost:3000/api/users');
      data = await data.json();
      setUser(data);
    }
    fetchData();
  },[])

  return (
    <div className="relative flex flex-col w-full shadow-lg rounded-lg">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' className='p-2 w-[350px]' placeholder='Search here...'></input>
        </div>
        <div>
          <Link href='/dashboard/user' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>ADD</Link>
        </div>
      </div>
      <table className="table-auto w-full text-left">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>USER NAME</th>
            <th className='p-4'>USER PHONE</th>
            <th className='p-4'>USER ROLE</th>
            <th className='p-4'>ACTION</th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {
            user.map((item)=> {
            return(
            <tr className='hover:bg-gray-100' key={item._id}>
              <td className='py-2 px-4'>{item.usrName}</td>
              <td className='py-2 px-4'>{item.usrPhone}</td>
              <td className='py-2 px-4'>{item.usrRole}</td>
              <td className='flex py-2 text-lg gap-6  px-4'>
                <Link href={`/dashboard/user/${item._id}`}><FaEdit /></Link>
                <Link href={`/dashboard/userlist/${item._id}`}><RiDeleteBin5Fill /></Link>
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
