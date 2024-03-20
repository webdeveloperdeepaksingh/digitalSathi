'use client';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import { BASE_API_URL } from '../../../../utils/constants';
import { RiDeleteBin5Fill } from "react-icons/ri";
import Loading from './loading';
import Pagination from '@/components/Pagination/page';


export default function UserList() {

  const [isLoading, setIsLoading] = useState(true);
  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
  const [user, setUser] = useState([]);
  const [query, setQuery] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  useEffect(()=>{

    let api = '';
    if(query != ''){
      //get courses as per query entered.
      api = `${BASE_API_URL}/api/users?userId=${loggedInUser.result._id}&query=${query}`
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
      api = `${ BASE_API_URL }/api/users?userId=${loggedInUser.result._id}&pageNbr=${page}`
    }
    async function fetchData() {
    try 
      {
        const res = await fetch(api, {cache: "no-store"});
        if(!res.ok){
          throw new Error("Error fetching user data.");
        }
        const userList = await res.json();
        setUser(userList.posts);
        setTotalPages(userList.totalPages);
      } catch (error) {
         console.error("Error fetching data: ", error );
      }finally{
        setIsLoading(false);
      }
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[query, currentPage])

  const handleSearch = (data) =>{
    setQuery(data);
    console.log(data);
  }

  if(isLoading){
    return <div><Loading/></div>
  }
  
  return (
    <div className="relative flex flex-col w-full ">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' onKeyUp={(e)=> handleSearch(e.target.value)} className='py-2 px-3 max-w-[400px] focus:outline-amber-500' placeholder='Search user name...'></input>
        </div>
        <div>
          <Link href='/dashboard/user' className='py-3 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>ADD</Link>
        </div>
      </div>
      <table className="table-auto w-full text-left shadow-lg rounded-lg">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>USER NAME</th>
            <th className='p-4'>USER ID</th>
            <th className='p-4'>USER EMAIL</th>
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
              <td className='py-2 px-4'>{item._id}</td>
              <td className='py-2 px-4'>{item.usrEmail}</td>
              <td className='py-2 px-4'>{item.usrPhone}</td>
              <td className='py-2 px-4'>{item.usrRole}</td>
              <td className='flex py-2 px-4 text-lg gap-3'>
                <Link href={`/dashboard/user/${item._id}`}><FaEdit /></Link>
                <Link href={`/dashboard/userlist/${item._id}`}><RiDeleteBin5Fill /></Link>
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
