"use client";
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import SalesChart from "@/components/SalesChart/page";
import RevenueCurrentMonth from "@/components/Revenue/page";
import EventRegisteredCurrentMonth from "@/components/EventRegistered/page";
import EnquiryCurrentMonth from "@/components/EnquiryMade/page";
import SignupsCurrentMonth from "@/components/SignUps/page";

export default function Home () {   
  
  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"), usrRole:Cookies.get("loggedInUserRole")}};
  const [date, setDate] = useState({startDate:'', endDate:''});
  const [errorMessage, setErrorMessage] = useState(''); 
 
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(name, value);
    setDate((prev) =>{
    return {
        ...prev, [name]: value
    }
  }); 
  }

  
  return (
    <div>
    {
        loggedInUser.result?.usrRole === "STUDENT" ? 
      (
        <div className='relative bg-gray-100 grid grid-cols-1 w-full text-center uppercase font-bold shadow-lg rounded-lg p-9'>
          <div className="bg-white p-9">
            <h1 className='text-6xl text-amber-500'>Welcome</h1>
            <h1 className='text-6xl text-amber-500'>to DigitalSathi</h1>
            <h1 className='text-6xl'>Online Learning Portal</h1>
          </div>
        </div>
      ): 
        loggedInUser.result?.usrRole === "INSTRUCTOR" ? 
      (
        <div className='flex flex-col w-full h-auto p-9 bg-gray-100 border border-solid shadow-lg rounded-lg' >
          <div className='grid grid-cols-1 md:grid-cols-2  w-full gap-9'>
              <div className="w-full">
                <RevenueCurrentMonth/> 
              </div>
              <div className="w-full">
                <EventRegisteredCurrentMonth/> 
              </div>
          </div>
        </div>
      ): 
        loggedInUser.result?.usrRole === "ADMIN" ?
      (
        <div className='flex flex-col w-full h-auto p-9 bg-gray-100 border border-solid shadow-lg rounded-lg'>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 w-full">
              <div className="w-auto">
                <RevenueCurrentMonth/> 
              </div>
              <div className="w-auto">
                <EventRegisteredCurrentMonth/> 
              </div>
              <div className="w-auto">
                <EnquiryCurrentMonth/>
              </div>
              <div className="w-auto">
                <SignupsCurrentMonth/> 
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex w-auto  bg-white rounded-lg shadow-lg my-9">
                 <SalesChart/>
              </div>
              <form className="flex bg-white shadow-lg rounded-lg flex-col p-9">
                <p className="text-lg text-amber-500 font-bold uppercase">Filter sales for a specific date range:</p>
                <div className="grid md:grid-cols-2 gap-1 w-full my-3">
                  <div className="flex flex-col">
                    <label htmlFor="startDate">START DATE:</label>
                    <input type="date" name='startDate'id="startDate"   value={date.startDate}  onChange={handleChange}  className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="endDate">END DATE:</label>
                    <input type="date" name='endDate'  id="endDate" value={date.endDate} onChange={handleChange}  className='py-2  px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
                  </div>
                </div>
                {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
                <div className="mt-3">
                  <button type='submit' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>FILTER</button>
                </div>
              </form>
          </div> 
        </div>
      ): null
     }
    </div>
  );
}
