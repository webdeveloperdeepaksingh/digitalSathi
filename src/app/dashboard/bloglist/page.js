'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function BlogList() {

  const [showAlert, setShowAlert] = useState(false);
  const [blog, setBlog] = useState([]);

  useEffect(() =>{
    async function fetchData() {
      let data = await fetch('http://localhost:3000/api/blogs');
      data = await data.json();
      setBlog(data);
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
          <Link href='/dashboard/blog' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>ADD</Link>
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
            blog.map((item)=> {
            return(
            <tr className='hover:bg-gray-100' key={item._id}>
              <td className='py-2 px-4'>{item.blgName}</td>
              <td className='py-2 px-4'>{item.blgCat}</td>
              <td className='py-2 px-4'>{item.blgAuth}</td>
              <td className='py-2 px-4'>{item.createdAt}</td>
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
  )
}
