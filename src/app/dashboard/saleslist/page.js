'use client';
import Cookies from 'js-cookie';
import { BASE_API_URL } from '../../../../utils/constants';
import { RiArrowDownSLine } from "react-icons/ri";
import React, { useEffect, useState } from 'react';
import Loading from './loading';
import Pagination from '@/components/Pagination/page';
 

export default function SalesList() {

  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [toggle, setToggle] = useState(false);
  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
  const [query, setQuery] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  

  useEffect(()=>{

    let api = '';
    if(query != ''){
      //get sales as per query entered.
      api = `${ BASE_API_URL }/api/sales?userId=${loggedInUser.result._id}&query=${query}`
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
      api = `${ BASE_API_URL }/api/sales?userId=${loggedInUser.result._id}&pageNbr=${page}`
    }
    async function fetchData() {
    try 
      {
        const res = await fetch(api);
        if(!res.ok){
          throw new Error("Error fetching sales data.");
        }
        const salesList = await res.json();
        setSales(salesList.transectionList);
        setTotalPages(salesList.totalPages);
      } catch (error) {
        console.error("Error fetching data.", error);
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

  const handleToggle = (index) => { 
    if(toggle === index){
      setToggle(null); 
    } else {
      setToggle(index);
    }
}

  if(isLoading){
    return <div><Loading/></div>
  }

  return (
    <div>
      <div className="relative flex flex-col w-full ">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' onKeyUp={(e) => handleSearch(e.target.value)} className='p-2 w-[350px] focus:outline-amber-500' placeholder='Search email id here...'></input>
        </div>
        <div>
          <button className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>ADD</button>
        </div>
      </div>
      <table className="table-auto w-full text-left shadow-lg rounded-lg">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>CUSTOMER</th>
            <th className='p-4'>PAYMENT ID</th>
            <th className='p-4'>INVOICE [&#8377;]</th>
            <th className='p-4'>EMAIL ID</th>
            <th className='p-4'>PHONE NO.</th>
            <th className='p-4'>TRANS DATE</th>
            <th className='p-4'>ACTION</th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {
            sales.map((item, index)=> {
            return(
            <>
            <tr  key={index}  className='hover:bg-gray-100'>
              <td className='py-1 pl-4'>{item.custName}</td>
              <td className='py-1 pl-4'>{item.razorpay_payment_id}</td>
              <td className='py-1 pl-4'>{(item.amtToPay).toLocaleString()}</td>
              <td className='py-1 pl-4'>{item.custEmail}</td>
              <td className='py-1 pl-4'>{item.custPhone}</td>
              <td className='py-1 pl-4'>{new Date(item.createdAt).toLocaleString()}</td>
              <td className='py-1 pl-4'>
                <button type='button' onClick={() => handleToggle(index)} ><RiArrowDownSLine className={toggle === index ? "text-2xl  duration-500" : "text-2xl rotate-180  duration-500"} /></button>
              </td>
            </tr>
            {
              item.custProducts?.map((cust) =>{
                return (
                  <table key={index} className={toggle === index ? "flex flex-col hover:bg-gray-100 table-auto w-full text-left rounded-lg" : "hidden"}>
                    <tbody className='divide-y'>
                      <tr>
                        <td className='py-1 pl-4'>{cust.prodName} </td>
                      </tr>
                    </tbody>
                  </table>
                )
              })
            }
            </>
              )
            })
          }
        </tbody>
      </table>
      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
    </div>
  )
}
