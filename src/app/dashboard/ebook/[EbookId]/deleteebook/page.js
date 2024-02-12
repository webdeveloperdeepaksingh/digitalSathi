'use client';
import React from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DelEbook({params}) {

  const router = useRouter();

  const handleSubmit = async (e) => {   
    e.preventDefault();
    let response = await fetch(`http://localhost:3000/api/ebooks/${params.EbookId}`, {
        method:'DELETE'
    });
    
    response = await response.json();
    toast('Ebook deleted successfully!', {
      hideProgressBar: false,
      autoClose: 1500,
      type: 'success'
    });
    router.push('/dashboard/ebooklist');
  }

  return (
    <div>
      <div className='bg-white w-[300px] mt-24 flex justify-center items-center  shadow-lg rounded-lg  mx-auto'>
        <div className='flex flex-col border border-solid border-amber-600 rounded-lg'>
            <div className='flex flex-col bg-white p-4 rounded-lg'>
                <form className='flex flex-col p-3'onSubmit={handleSubmit}>
                    <div className='flex flex-col text-center mb-3'>
                        <label className='text-red-700 font-bold'>Alert!</label>
                        <p >You wont be able to restore. Are you sure to delete...?</p>
                    </div>
                    <div className='flex gap-3 justify-center'>
                        <button type='submit' className='py-1 px-2 rounded-sm bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold'>DELETE</button>
                        <Link href='/dashboard/ebooklist' className='py-1 px-2 rounded-sm bg-gray-600 hover:bg-gray-500 text-white text-sm font-bold'>CANCEL</Link>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  )
}