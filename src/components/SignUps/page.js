'use client';
import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../../../utils/constants';
import Cookies from 'js-cookie';
import Loading from './loading';
 
export default function SignupsCurrentMonth() {

  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"), usrRole:Cookies.get("loggedInUserRole")}};
  const [signupCount, setSignupCount] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    async function fetchSignupCount(){
    try 
        {
            const res = await fetch(`${BASE_API_URL}/api/signupcount?userId=${loggedInUser.result._id}`, {cache: "no-store"});
            if(!res.ok){
                throw new Error("Error fetching signup counts.");
            }
            const signupCountData = await res.json();
            setSignupCount(signupCountData.userList);
            console.log(signupCountData.userList);
        } catch (error) {
            console.error("Error fetching revenue: ", error);
        } finally{
            setIsLoading(false);
        }
    }
    fetchSignupCount();
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
                    <p className='text-lg font-bold'>SIGN UPS</p>
                    <p className='text-sm'>Current Month Sign Ups</p>
                </div>
                <div className='flex flex-col text-center my-3'>
                    <p className='text-sm'>{signupCount.length}</p>
                </div>
            </div>
       </div>
    </div>
  )
}
