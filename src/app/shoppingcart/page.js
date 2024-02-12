'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { RxCross2 } from "react-icons/rx";
import NavBar from '@/components/NavBar/page';
import {toast} from 'react-toastify';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../../../redux/slices/cartSlice';
import BuyProduct from '@/components/RazorPay/BuyProduct';
import CustomerDetails from '@/components/CustomerDetails/page';
 

export default function ShoppingCart() {

  const cartItems = useSelector((store) => store.cart)
  const [showCustomerDetailsForm, setShowCustomerDetailsForm] = useState(false);
  const totalPrice = cartItems.totalPrice;
  const [transDetails, setTransDetails] = useState('');

  const dispatch = useDispatch();
  const handleDelete = (course) =>{
    dispatch(removeFromCart(course));
    toast('Item removed...!', {
      hideProgressBar: false,
      autoClose: 500,
      type: 'success',
      position: 'top-center'      
  });
  }

  const handleCustomerDetails = (data) =>{
    setShowCustomerDetailsForm(true);
    setTransDetails(data);
    console.log(data);
  }  

  return (
    <div className='relative '  >
      <div className={showCustomerDetailsForm == true ? 'absolute inset-0 flex items-center justify-center z-100 mx-auto' : 'hidden'}>
        <CustomerDetails transDetails={transDetails} setShowCustomerDetailsForm={setShowCustomerDetailsForm} />
      </div> 
      <div className='h-[90px]'><NavBar/></div>
      <div className='md:flex w-full p-9 gap-9'>
        <div className='w-full'>
        {
          cartItems.items.map((item)=>{
            return(
              <div key={item._id} className='relative flex max-w-[980px] p-3 h-auto bg-gray-100 mb-2 rounded-md shadow-md '>
                <button type='button' onClick={()=> handleDelete(item)} className='cursor-pointer hover:bg-white bg-gray-100 absolute right-3 top-3 font-bold text-lg'><RxCross2/></button>
                <Image alt={item.prodName} src={`/images/${item.prodImage}`} width={150} height={50} />
                <div className='flex flex-col px-2 w-auto'>
                  <h1 className='text-lg uppercase font-bold'>{item.prodName}</h1>
                  <p className='hidden   md:block  text-justify'>{item.prodIntro}</p>
                  <div className='md:flex w-auto gap-1 mt-2'>
                      <p className='text-sm py-1 px-2 w-auto rounded-sm bg-amber-600 text-white'><span className='font-bold mr-3'>Course Validity:</span>{item.prodVal}</p>
                      <p className='text-sm py-1 px-2  w-auto rounded-sm bg-gray-500 text-white'><span className='font-bold mr-3'>Course Price:</span>{item.prodDisc}</p>
                  </div>
                </div>
              </div>
            )
          })
        }
        </div>
        <div className='flex flex-col p-6 rounded-md border-2 border-amber-600 max-w-[450px] md:min-w-[450px] h-auto'>
          <div className='bg-amber-600 rounded-md mb-2'>
            <p className='text-xl text-white text-center font-bold p-3'>Order Summary</p>
          </div>
          <div className='flex bg-gray-100 '>
            <p className='text-md w-[40px] font-bold p-2'>Sr.</p>
            <p className='text-md w-[350px] font-bold p-2'>Item Description</p>
            <p className='text-md w-[70px] font-bold p-2'>Price</p>
          </div>
          {
            cartItems.items.map((item, i) =>{
              return (
                <div key={item._id} className='flex'>
                  <p className='text-sm w-[40px] pl-2 pt-1'>{i + 1}.</p>
                  <p className='text-sm w-[440px] pl-2 pt-1'>{item.prodName}</p>
                  <p className='text-sm w-[70px] pl-2  pt-1'>{item.prodDisc}</p>
                </div>
              )
            })
          }
          <div className='relative flex flex-col border-y-2 border-amber-600 mt-6 p-2'>
              <span className='font-bold'>Total Amout:</span>
              <p className='absolute right-4'>{totalPrice}</p>
              <span className='font-bold'>Discount:</span>
          </div>
          <div className='relative flex flex-col p-2 border-b-2  border-amber-600'>
            <span className='font-bold'>Net Amount:</span>
            <p className='absolute right-4'>{totalPrice}</p>
            <span className='font-bold'>Tax:</span>
          </div>
          <div className='relative flex flex-col p-2 mb-9'>
            <span className='font-bold'>Amount to Pay:</span>
            <p className='absolute right-4'>{totalPrice}</p>
          </div>
          <button  onClick={()=>handleCustomerDetails(cartItems.items)} className='bg-amber-600 text-white w-full text-xl text-center font-bold p-3 rounded-md'>
              Checkout
          </button>
        </div>
      </div>  
    </div>
  )
}
