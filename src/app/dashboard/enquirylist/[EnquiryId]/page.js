'use client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BASE_API_URL } from '../../../../../utils/constants';
 
export default function DelEnquiry({params}) {

  const router = useRouter();

  const handleSubmit = async (e) => {   
    e.preventDefault();
    let response = await fetch(`${BASE_API_URL}/api/enquiries/${params.EnquiryId}`, {
        method:'DELETE'
    });
    response = await response.json();
    toast('Enquiry deleted successfully!', 
    {
      hideProgressBar: false,
      autoClose: 1000,
      type: 'success'
    });
    router.push('/dashboard/enquirylist');
  }

  return (
    <div>
      <div className='bg-white w-[300px] mt-24 flex justify-center items-center  shadow-lg rounded-lg  mx-auto'>
        <div className='flex flex-col border border-solid border-amber-500 rounded-lg'>
            <div className='flex flex-col bg-white p-4 rounded-lg'>
                <form className='flex flex-col p-3'onSubmit={handleSubmit}>
                    <div className='flex flex-col text-center mb-3'>
                        <label className='text-red-700 text-2xl font-bold'>Alert!</label>
                        <p >You wont be able to restore. Are you sure to delete...?</p>
                    </div>
                    <div className='flex gap-3 justify-center'>
                        <button type='submit' className='py-1 px-2 rounded-sm bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold'>DELETE</button>
                        <Link href='/dashboard/enquirylist' className='py-1 px-2 rounded-sm bg-gray-600 hover:bg-gray-500 text-white text-sm font-bold'>CANCEL</Link>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  )
}