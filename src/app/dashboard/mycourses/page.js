'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { RiVideoFill } from "react-icons/ri";
import { BASE_API_URL } from '../../../../utils/constants';
 import Loading from './loading';
import Cookies from 'js-cookie';

export default function MyCourses() {

  const [isLoading, setIsLoading] = useState(true);
  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
  const [course, setCourse] = useState([]);
  const [query, setQuery] = useState([]);
  

  useEffect(()=>{

    let api = '';
    if(query != ''){
      //get courses as per query entered.
      api = `${BASE_API_URL}/api/mycourses?userId=${loggedInUser.result._id}&query=${query}`
    }else{
      api = `${ BASE_API_URL }/api/mycourses?userId=${loggedInUser.result._id}`
    }
    async function fetchData() {
    try 
    {
      const res = await fetch(api, {cache: "no-store"});
      if(!res.ok){
        throw new Error('Error fetching course data');
      }
      const coList = await res.json();
      setCourse(coList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }finally {
      setIsLoading(false); // Mark loading as complete
    } 
  }
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[query])

  const handleSearch = (data) =>{
    setQuery(data);
  }

  if (isLoading) {
    return <div><Loading/></div>; // Show loading state
  }

  return (
    <div className="relative flex flex-col w-full">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' onKeyUp={(e) => handleSearch(e.target.value)} className='py-2 max-w-[400px] focus:outline-amber-500' placeholder='Search course title...'></input>
        </div>
      </div>
      <table className="table-auto w-full text-left shadow-lg rounded-lg">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>COURSE TITLE</th>
            <th className='p-4'>CATEGORY</th>
            <th className='p-4'>INSTRUCTOR</th>
            <th className='p-4'>PRICE</th>
            <th className='p-4'>WATCH</th>
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
                <Link href={`/dashboard/watchcourse/${item._id}`}><RiVideoFill/></Link>
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
