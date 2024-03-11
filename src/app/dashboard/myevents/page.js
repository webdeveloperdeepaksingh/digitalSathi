'use client';
import Loading from './loading';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { RiLiveFill } from "react-icons/ri";
import { BASE_API_URL } from '../../../../utils/constants';
 
export default function MyEvent() {

   const [isLoading, setIsLoading] = useState(true);
   const [event, setEvent] = useState([]);
   const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
   const [query, setQuery] = useState([]);
   

   useEffect(()=>{
 
     let api = '';
     if(query != ''){
       //get ebooks as per query entered.
       api = `${BASE_API_URL}/api/myevents?userId=${loggedInUser.result._id}&query=${query}`
     }else{
      api = `${ BASE_API_URL }/api/myevents?userId=${loggedInUser.result._id}`
    }
     async function fetchData() {
      try 
      {
        const res = await fetch(api);
        if(!res.ok){
          throw new Error("Error fetching event data.");
        }
        const eventList = await res.json();
        setEvent(eventList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }finally {
        setIsLoading(false); 
      }
    }
    fetchData();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[query])

   if (isLoading) {
    return <div><Loading/></div>; // Show loading state
  }
  
   const handleSearch = (data) =>{
     setQuery(data);
     console.log(data);
   }

  return (
    <div className="relative flex flex-col w-full ">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' onKeyUp={(e) => handleSearch(e.target.value)} className='p-2 w-[350px] focus:outline-amber-500' placeholder='Search event title here...'></input>
        </div>
      </div>
      <table className="table-auto w-full text-left shadow-lg rounded-lg">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>EVENT TITLE</th>
            <th className='p-4'>CATEGORY</th>
            <th className='p-4'>CONTACT</th>
            <th className='p-4'>EVENT DATE</th>
            <th className='p-4'>EVENT TIME</th>
            <th className='p-4'>ZOOM LINK</th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {
            event.map((item)=> {
            return(
            <tr className='hover:bg-gray-100' key={item._id}>
              <td className='py-2 px-4 flex items-center'>{item.prodName}</td>
              <td className='py-2 px-4'>{item.prodCat}</td>
              <td className='py-2 px-4'>{item.prodAuth}</td>
              <td className='py-2 px-4'>{item.prodDate}</td>
              <td className='py-2 px-4'>{item.prodTime}</td>
              <td className='flex py-2 text-lg gap-6  px-4'>
                <button type='button'>
                  <a href={item.prodMeetLink} target="_blank" rel="noopener noreferrer"><RiLiveFill/></a>
                </button>
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
