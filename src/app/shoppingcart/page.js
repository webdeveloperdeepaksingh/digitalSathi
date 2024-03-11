'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { RxCross2 } from "react-icons/rx";
import NavBar from '@/components/NavBar/page';
import {toast} from 'react-toastify';
import { BASE_API_URL } from '../../../utils/constants';
import Loading from './loading';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../../../redux/slices/cartSlice';
import CustomerDetails from '@/components/CustomerDetails/page';
 

export default function ShoppingCart() {

  const [isLoading, setIsLoading] = useState(true);
  const cartItems = useSelector((store) => store.cart)
  const [tax, setTax] = useState('');
  const settId = "65c8e1dad3c601a36e0dd62f"
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

  useEffect(() =>{
    async function fetchSett() {
    try 
      {
        const res = await fetch(`${BASE_API_URL}/api/settings/${settId}`);
        if(!res.ok){
            throw new Error("Error fetching settData.");
        }
        const settingData = await res.json();
        setTax(settingData.result);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally{
        setIsLoading(false);
      }
    }
    fetchSett();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[settId])

  const discount = (totalPrice * (tax.brandDisc/100)).toFixed(2);
  const netAmount = (totalPrice - discount);
  const taxAmount = (netAmount * (Number(tax.brandTax))/100).toFixed(2);
  const amtToPay = (Number(netAmount) + Number(taxAmount)).toFixed(2);

  if(isLoading){
    return <div><Loading/></div>
  }

  return (
    <div className='relative '  >
      <div className={showCustomerDetailsForm == true ? 'absolute inset-0 flex items-center justify-center z-100 mx-auto' : 'hidden'}>
        <CustomerDetails transDetails={transDetails} setShowCustomerDetailsForm={setShowCustomerDetailsForm} />
      </div> 
      <div className='h-[105px]'><NavBar/></div>
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
                      <p className='text-sm py-1 px-2 w-auto rounded-sm bg-amber-500 text-white'><span className='font-bold mr-3'>Validity:</span>{item.prodVal}</p>
                      <p className='text-sm py-1 px-2  w-auto rounded-sm bg-gray-400 text-white'><span className='font-bold mr-3'>Price:</span>{item.prodDisc}</p>
                      <p className='text-sm py-1 px-2  w-auto rounded-sm bg-green-500 text-white'><span className='font-bold mr-3'>Author/Instructor:</span>{item.prodAuth}</p>
                  </div>
                </div>
              </div>
            )
          })
        }
        </div>
        <div className='flex flex-col p-6 rounded-md border-2 border-amber-500 max-w-[450px] md:min-w-[450px] h-auto'>
          <div className='bg-amber-500 rounded-md mb-2'>
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
          <div className='relative flex flex-col border-y-2 border-amber-500 mt-6 p-2'>
              <span className='font-bold'>Total Amout:</span>
              <p className='absolute right-4'>{totalPrice}</p>
              <p className='font-bold'>Discount: <span className='font-normal text-sm'>{tax.brandDisc} %</span></p>
              <p className='absolute right-4 top-8'>{discount}</p>
          </div>
          <div className='relative flex flex-col p-2 border-b-2  border-amber-500'>
            <span className='font-bold'>Net Amount:</span>
            <p className='absolute right-4 top-2'>{netAmount}</p>
            <p className='font-bold'>Tax: <span className='font-normal text-sm'>{tax.brandTax} %</span></p>
            <p className='absolute right-4 top-8'>{taxAmount}</p>
          </div>
          <div className='relative flex flex-col p-2 mb-9'>
            <span className='font-bold'>Amount to Pay:</span>
            <p className='absolute right-4'>{amtToPay}</p>
          </div>
          <button  onClick={()=>handleCustomerDetails(cartItems.items)} className='bg-amber-500 text-white w-full text-xl text-center font-bold p-3 rounded-md'>
              Checkout
          </button>
        </div>
      </div>  
    </div>
  )
}
