'use client';
import NavBar from '@/components/NavBar/page'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import InnerBanner from '../../../public/images/inrbnr.jpg';
import React, { useState } from 'react'
import Footer from '@/components/Footer/page';

export default function ContactUs() {


  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [data, setData] = useState({eqrPerson:'', eqrPhone:'', eqrEmail:'', eqrSub:'', eqrMsg:'' });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(name, value);
    setData((prev) =>{
    return {
        ...prev, [name]: value
    }
  }); 
}

const handleSubmit = async (e) => {
e.preventDefault();

setErrorMessage(''); //Clear the previous error

    let errMsg=[];
    
    if (!data.eqrPerson.trim()) {
        errMsg.push('Full name is required.');    
    }
    
    if (!data.eqrPhone.trim()) {
        errMsg.push('Phone is required.');    
    }

    if (!data.eqrEmail.trim()) {
        errMsg.push('Email is required.');    
    }

    if(errMsg.length>0){
        setErrorMessage(errMsg.join(' || '));
        return;
    }
try
{
  const result = await fetch ('http://localhost:3000/api/enquiries', 
  {
    method:'POST',
    body:JSON.stringify({eqrPerson:data.eqrPerson, eqrPhone:data.eqrPhone, eqrEmail:data.eqrEmail, eqrSub:data.eqrSub, eqrMsg:data.eqrMsg})
  });

  const post = await result.json();
  console.log(post);
  alert('Enquiry submitted successfully...!')
  router.push('/contactus');

}catch(error) {
    console.log(error);
  }
}

  return (
    <div>
      <div className='h-[88px]'></div>
      <title>DigitalSathi | Contact Us </title>
      <div className='w-full h-auto'>
        <Image alt='innerBanner' src={InnerBanner} width={1540} height={400}></Image>
      </div>
      <div className='flex flex-col w-full p-9'>   
        <div className='grid md:grid-cols-2 gap-3 w-full border border-solid rounded-md p-9'>
          <div>
            <form className='bg-gray-200 p-9' onSubmit={handleSubmit}>
              <div className='flex flex-col mb-3'>
                  <label className='font-bold'>Full Name:*</label>
                  <input type='text' name='eqrPerson' value={data.eqrPerson} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
              </div>
              <div className='flex flex-col mb-3'>
                  <label className='font-bold'>Phone:*</label>
                  <input type='text' name='eqrPhone' value={data.eqrPhone} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
              </div>
              <div className='flex flex-col mb-3'>
                  <label className='font-bold'>Email:*</label>
                  <input type='text' name='eqrEmail' value={data.eqrEmail} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
              </div>
              <div className='flex flex-col mb-3'>
                  <label className='font-bold'>Subject:</label>
                  <input type='text' name='eqrSub' value={data.eqrSub} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600'></input>
              </div>
              <div className='flex flex-col mb-3'>
                  <label className='font-bold'>Message:</label>
                  <textarea type='text' name='eqrMsg' value={data.eqrMsg} onChange={handleChange} className='py-2 px-2 mt-2 border rounded-md  focus:outline-amber-600' rows='8'></textarea>
              </div>
              <div className='mb-3' >
                  <button type='submit' className='py-2 px-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-bold'>SUBMIT</button>
              </div>
              {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
            </form>
          </div>
          <div className='bg-amber-600 p-5'>
              <div className='bg-amber-500'>
                <h3 className='text-white text-2xl font-bold p-5 uppercase'>Get in touch with us...!</h3>
              </div>
              <div className='p-5'>
                <p className='text-lg text-white font-bold mb-3'>Our Contact:</p>
                <p>Call Us: 7605487925 / 6978547895</p>
                <p>Email Us: info@digitalsathi.com / support@digitalsathi.com</p>
              </div>
              <div className='p-5'>
                <p className='text-lg text-white font-bold mb-3'>Our Address:</p>
                <p>F-18, C.I.N City, </p>
                <p>Noida Extension, Gautam Budh Nagar,</p>
                <p>Noida, Uttar Pradesh - 201301.</p>
              </div>
              <div className='p-5 text-white'>
                <p className='text-lg font-bold mb-3'>Our Location:</p>
                <div className='h-[200px] rounded-md bg-gray-200'>
                        {/* GoogleMap */}
                </div>
              </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
