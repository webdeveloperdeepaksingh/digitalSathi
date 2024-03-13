'use client';
import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../../../utils/constants';
import Cookies from 'js-cookie';
import Loading from './loading'; 
 

export default function EventRegisteredCurrentMonth() {

  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"), usrRole:Cookies.get("loggedInUserRole")}};
  const [eventRegCount, setEventRegCount] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    async function fetchEventRegCount(){
    try 
        {
            const res = await fetch(`${BASE_API_URL}/api/eventcount?userId=${loggedInUser.result._id}`);
            if(!res.ok){
                throw new Error("Error fetching event counts.");
            }
            const eventCountData = await res.json();
            setEventRegCount(eventCountData.eventList);
            console.log(eventCountData.eventList);
        } catch (error) {
            console.error("Error fetching event counts: ", error);
        } finally{
            setIsLoading(false);
        }
    }
    fetchEventRegCount();
  },[loggedInUser.result._id])

  if(isLoading){
    <div>
        <Loading/>
    </div>
  }
  
  return (
    <div>
       <div className='flex max-w-[290px] h-auto justify-center shadow-lg rounded-md p-5 bg-white'>
            <div className='flex flex-col'>
                <div className='flex flex-col text-center'>
                    <p className='text-lg font-bold'>SUBSCRIBERS</p>
                    <p className='text-sm'>Current Month Registration</p>
                </div>
                <div className='flex flex-col text-center my-3'>
                    <p className='text-sm'>{eventRegCount.length}</p>
                </div>
            </div>
       </div>
    </div>
  )
}
