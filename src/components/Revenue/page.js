'use client';
import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../../../utils/constants';
import Cookies from 'js-cookie';
import Loading from './loading';
 

export default function RevenueCurrentMonth() {

  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"), usrRole:Cookies.get("loggedInUserRole")}};
  const [revenue, setRevenue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    async function fetchRevenue(){
    try 
        {
            const res = await fetch(`${BASE_API_URL}/api/revenue?userId=${loggedInUser.result._id}`, {cache: "no-store"});
            if(!res.ok){
                throw new Error("Error fetching revenue.");
            }
            const revenueData = await res.json();
            setRevenue(revenueData.paymentList);
         } catch (error) {
            console.error("Error fetching revenue: ", error);
        } finally{
            setIsLoading(false);
        }
    }
    fetchRevenue();
  },[loggedInUser.result._id])

  if(isLoading){
    <div>
        <Loading/>
    </div>
  }

  return (
    <div>
       <div className={`${loggedInUser.result.usrRole === "INSTRUCTOR" ? 'flex max-w-[600px] h-auto justify-center shadow-lg rounded-md p-5 bg-white' : 'flex max-w-[290px] h-auto justify-center shadow-lg rounded-md p-5 bg-white'}`}>
            <div className='flex flex-col'>
                <div className='flex flex-col text-center'>
                    <p className='text-lg font-bold'>REVENUE</p>
                    <p className='text-sm'>Current Month Sales</p>
                </div>
                <div className='flex flex-col text-center my-3'>
                    <p className='text-sm'> INR:&nbsp;
                        {
                            revenue.reduce((acc, item) => acc + item.amtToPay, 0).toLocaleString()
                        }
                    </p>
                </div>
            </div>
       </div>
    </div>
  )
}
