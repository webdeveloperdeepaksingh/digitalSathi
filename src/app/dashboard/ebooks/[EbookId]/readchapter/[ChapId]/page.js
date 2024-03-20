"use client";
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { BASE_API_URL } from '../../../../../../../utils/constants';
import Loading from '../../../loading';


export default function ReadChapter({params}) {

  const [isLoading, setIsLoading] = useState(true);
  const _id = params.ChapId;
  const [chapById, setChapById] = useState('');

  useEffect(() => {
    async function fetchEbookChap() {
    try 
      {
        const res = await fetch(`${BASE_API_URL}/api/ebooks/${params.EbookId}/getchapters/${_id}` , {cache: "no-store"});
        if (!res.ok) {
          throw new Error("Error fetching chapter data.")
        }
        const ebookChap = await res.json();
        setChapById(ebookChap.result); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }finally{
        setIsLoading(false);
      }
    }
    fetchEbookChap();
  }, [params.EbookId, _id]);

  if (isLoading) {
    return <div><Loading/></div>; // Show loading state
  }

  return (
    <div>
      <div className='w-full'>
        <div className='flex flex-col w-full h-auto'>
            <div className='flex flex-col  rounded-md'>
              <div className='text-xl font-bold p-4 bg-amber-500 text-white uppercase text-center'>{chapById.chapName}</div>
              <div className='border border-solid border-amber-500 p-6'>
                <Image className='h-[600px]' 
                  alt={chapById.chapName}
                  src={chapById.chapPdf}
                  width={1200}
                  height={600}
                  title={chapById.chapName}>
                </Image>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
