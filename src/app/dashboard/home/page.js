"use client";
import { BsCashCoin } from "react-icons/bs";
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import SalesChart from "@/components/SalesChart/page";

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
            <h1 className='text-6xl text-amber-600'>Welcome</h1>
            <h1 className='text-6xl text-amber-600'>to DigitalSathi</h1>
            <h1 className='text-6xl'>Online Learning Portal</h1>
          </div>
        </div>
      ): 
        loggedInUser.result?.usrRole === "INSTRUCTOR" ? 
      (
        <div className='flex flex-col w-full h-auto p-9 bg-gray-100 border border-solid shadow-lg rounded-lg' >
          <div className='relative grid grid-cols-1 md:grid-cols-2  w-full gap-9'>
            <div className='h-[200px] bg-white shadow-lg rounded-sm p-3'>
                <p className="font-bold text-xl text-black">Revenue:</p>
                <div className="p-3 flex items-center justify-between divide-x gap-3">
                    <span className="text-4xl  text-black"><BsCashCoin/></span>
                    <p className="text-amber-600 px-3">INR: </p>
                </div>
            </div>
            <div className='h-[200px] bg-white shadow-lg rounded-sm p-3'>
                <p className="font-bold text-xl text-white">Subscribers:</p>
                <div className="p-3 flex items-center justify-between divide-x gap-3">
                    <span className="text-4xl  text-white"><BsCashCoin/></span>
                    <p className="text-white px-3">INR: 68,729</p>
                </div>
            </div>
          </div>
        </div>
      ): 
        loggedInUser.result?.usrRole === "ADMIN" ?
      (
        <div className='flex flex-col w-full h-auto p-9 bg-gray-100 border border-solid shadow-lg rounded-lg'>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-auto gap-9">
              <div className=" bg-white rounded-lg shadow-lg">
                <iframe  
                  height={200}
                  style={{position: 'relative',  width: '100%'}}
                  src="https://charts.mongodb.com/charts-digitalsathi-kparf/embed/charts?id=65ddb677-396a-4b95-8b07-3c3011a35b19&maxDataAge=3600&theme=light&autoRefresh=true">
                </iframe> 
              </div>
              <div className="bg-white rounded-lg shadow-lg">
                <iframe 
                  height={200}
                  style={{position: 'relative',  width: '100%'}}
                  src="https://charts.mongodb.com/charts-digitalsathi-kparf/embed/charts?id=65ddb46f-432f-405e-8aff-0d9cf07f31cc&maxDataAge=3600&theme=light&autoRefresh=true">
                </iframe>
              </div>
              <div className="bg-white rounded-lg shadow-lg">
                <iframe 
                  height={200}
                  style={{position: 'relative',  width: '100%'}}
                  src="https://charts.mongodb.com/charts-digitalsathi-kparf/embed/charts?id=65ddb50f-432f-4390-8885-0d9cf081468f&maxDataAge=3600&theme=light&autoRefresh=true">
                </iframe> 
              </div>
              <div className="bg-white rounded-lg shadow-lg">
                <iframe 
                  height={200}
                  style={{position: 'relative',  width: '100%'}}
                  src="https://charts.mongodb.com/charts-digitalsathi-kparf/embed/charts?id=65ddb38a-4859-4b29-8c2c-8e9bcc4efde4&maxDataAge=3600&theme=light&autoRefresh=true">
                </iframe>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex w-full  bg-white rounded-lg shadow-lg my-9">
                 <SalesChart/>
              </div>
              <form className="flex bg-white shadow-lg rounded-lg flex-col p-9">
                <p className="text-lg text-amber-600 font-bold uppercase">Filter sales for a specific date range:</p>
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
                  <button type='submit' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>FILTER</button>
                </div>
              </form>
          </div> 
        </div>
      ): null
     }
    </div>
  );
}
