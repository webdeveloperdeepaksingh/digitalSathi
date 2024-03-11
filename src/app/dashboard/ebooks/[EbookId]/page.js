'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { LuBookOpen } from "react-icons/lu";
import { CgNotes } from "react-icons/cg";
import Loading from '../loading';
import { BASE_API_URL } from '../../../../../utils/constants';
 

export default function ListOfChapters({params}) {

   const [isLoading, setIsLoading] = useState(true);
   const [chapter, setChapter] = useState([]);
   const [ebookById, setEbookById] = useState('');
   const [query, setQuery] = useState([]);
   const _id = params.EbookId;
 
   useEffect(()=>{
    async function getEbookById(){
    try 
      {
        const res = await fetch(`${BASE_API_URL}/api/ebooks/${_id}`);
        if(!res.ok){
          throw new Error("Error fetching ebook data.")
        }
        const ebookData = await res.json();
        setEbookById(ebookData.result);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    getEbookById();
   },[_id])

   useEffect(()=>{
     let api = '';
     if(query != ''){
       //get chapters as per query entered.
       api = `${BASE_API_URL}/api/ebooks/${_id}/getchapters?query=${query}`
     }else{
       //get all chapters.
       api = `${BASE_API_URL}/api/ebooks/${_id}/getchapters`
     }
    async function fetchEbookChap() {
    try 
      {
        const res = await fetch(api);
        if(!res.ok){
          throw new Error("Error fetching chapter data.")
        }
        const ebookChapList = await res.json();
        setChapter(ebookChapList.result);
       } catch (error) {
            console.error("Error fetching data.", error);
       }finally{
        setIsLoading(false);
       }
     }
     fetchEbookChap();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[query])
 
   const handleSearch = (data) =>{
     setQuery(data);
     console.log(data);
   }

   if(isLoading){
    return <div><Loading/></div>
   }

  return (
    <div className="relative flex flex-col w-full shadow-lg rounded-lg">
      <div className='flex items-center justify-between mb-2'>
        <div className='border border-solid rounded-sm shadow-md'>
          <input type='search' onKeyUp={(e) => handleSearch(e.target.value)} className='p-2 w-[350px] focus:outline-amber-600' placeholder='Search chapter name here...'></input>
        </div>
      </div>
      <table className="table-auto w-full text-left">
        <thead className='font-bold bg-gray-300'>
          <tr>
            <th className='p-4'>CHAPTER NAME</th>
            <th className='p-4'>EBOOK</th>
            <th className='p-4'>READ</th>
          </tr>
        </thead>
        <tbody className='divide-y'>
          {
            chapter.map((item)=> {
            return(
            <tr className='hover:bg-gray-100' key={item._id}>
              <td className='py-2 px-2 flex items-center '><CgNotes className='mx-2' />{item.chapName}</td>
              <td className='py-2 px-4'>{ebookById.prodName}</td>
              <td className='flex py-2 text-lg gap-6  px-4'>
                <Link href={`/dashboard/ebooks/${_id}/readchapter/${item._id}`}><LuBookOpen/></Link>
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
