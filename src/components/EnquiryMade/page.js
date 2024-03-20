'use client';
import React, { useEffect, useState } from 'react';
import Loading from './loading'; 
import Cookies from 'js-cookie';
import { BASE_API_URL } from '../../../utils/constants';

export default function EnquiryCurrentMonth() {

  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"), usrRole:Cookies.get("loggedInUserRole")}};
  const [enquiryCount, setEnquiryCount] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    async function fetchEnquiryCount(){
    try 
        {
            const res = await fetch(`${BASE_API_URL}/api/enquirycount?userId=${loggedInUser.result._id}`, {cache: "no-store"});
            if(!res.ok){
                throw new Error("Error fetching enquiry counts.");
            }
            const enquiryCountData = await res.json();
            setEnquiryCount(enquiryCountData.enquiryList);
            console.log(enquiryCountData.enquiryList);
        } catch (error) {
            console.error("Error fetching enquiry counts: ", error);
        } finally{
            setIsLoading(false);
        }
    }
    fetchEnquiryCount();
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
                    <p className='text-lg font-bold'>ENQUIRIES</p>
                    <p className='text-sm'>Current Month Enquiries</p>
                </div>
                <div className='flex flex-col text-center my-3'>
                    <p className='text-sm'>{enquiryCount.length}</p>
                </div>
            </div>
       </div>
    </div>
  )
}
