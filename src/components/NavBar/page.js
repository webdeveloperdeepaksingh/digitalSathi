'use client';
import { usePathname } from 'next/navigation';
import { FaCartPlus } from "react-icons/fa6";
import {AiOutlineClose, AiOutlineMenu} from 'react-icons/ai';
import Image from 'next/image';
import Link from 'next/link';
import { BASE_API_URL } from '../../../utils/constants';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loading from './loading'; 

export default function NavBar() {

const [isLoading, setIsLoading] = useState(true);
const settId = "65c8e1dad3c601a36e0dd62f";
const [logo, setLogo] = useState('');

useEffect(()=>{
    async function fetchSettings(){
    try 
    {
        const res = await fetch(`${BASE_API_URL}/api/settings/${settId}`);
        if(!res.ok){
            throw new Error("Error fetching settData.");
        }
        const logoImage = await res.json();
        setLogo(logoImage.result); 
    } catch (error) {
        console.error("Error fetching data: ", error);
    }finally{
        setIsLoading(false);
    }
}
fetchSettings();
// eslint-disable-next-line react-hooks/exhaustive-deps
},[])

  const menues = [
    {
        name:'HOME',
        url:'/'
    },
    {
        name:'ABOUT',
        url:'/about'
    },
    {
        name:'COURSES',
        url:'/courses'
    },
    {
        name:'EBOOKS',
        url:'/ebooks'
    },
    {
        name:'EVENTS',
        url:'/events'
    },
    {
        name:'BLOGS',
        url:'/blogs'
    },
    {
        name:'CONTACT',
        url:'/contactus'
    }
  ]
  const currentRoute = usePathname();
  const [menuIcon, setMenuIcon] = useState(false);

  const handleMenuToggle = ()=>{
    setMenuIcon(!menuIcon);
  }
  const cartItems = useSelector((store) => store.cart)

  if(isLoading){
    return <div><Loading/></div>
  }

  return (
    < >
    <nav className='flex w-full shadow-lg bg-white px-4 fixed z-50 mx-auto py-1 justify-between items-center'>
        <Image alt='digitalsathi' src={`/images/${logo.brandLogo}`} height={90} width={200}/>
        <ul className='hidden md:flex gap-5 '>
            {
                menues.map((item, i) =>{
                    return (
                        <Link href={item.url} className={currentRoute === `${item.url}` ? "font-bold text-amber-500" : ""} key={i}>
                            <p >{item.name}</p>
                        </Link>
                    )
                })
            }
        </ul>
        <div className='flex  items-center'>
            <div className='relative flex flex-col'>
                <Link href='/shoppingcart'><span className='cursor-pointer rounded-full absolute right-[14px] bottom-[12px] w-[16px] h-[16px] bg-amber-500 text-white text-center items-center justify-center text-xs font-bold'>{cartItems.totalQuantity}</span></Link>
                <Link href='/shoppingcart'><FaCartPlus className='mx-3 text-2xl text-amber-500 cursor-pointer'/></Link>
            </div>
            <Link href='/login' className='py-2 px-3 hover:bg-amber-400 bg-amber-500 font-bold text-white'>LOGIN</Link>
        </div>
        <div onClick={handleMenuToggle} className='flex md:hidden'>
            {menuIcon ?
                (<AiOutlineClose className='text-4xl mx-3 shadow-lg p-2 cursor-pointer'/>)
                :
                (<AiOutlineMenu className='text-4xl mx-3 shadow-lg p-2 cursor-pointer'/>)
            }
        </div>
        <div className={menuIcon ?
            'md:hidden absolute top-[86px] right-0 bottom-0 left-0 flex justify-center items-center text-center w-full h-[50vh] bg-amber-500 text-white case-in duration-700'
            :
            'md:hidden absolute top-[86px] right-0 bottom-0 left-[-100%] flex justify-center items-center text-center w-full h-[50vh] bg-amber-500 text-white case-in duration-700'
            }>
            <div className='w-full'>
                <ul className='font-bold text-md px-5'>
                {
                    menues.map((item, i) =>{
                        return (
                           <div key={i} className='group hover:bg-white rounded-md py-2'>
                             <Link href={item.url} onClick={handleMenuToggle} className=' group-hover:text-black cursor-pointer' key={i}>
                                <p >{item.name}</p>
                            </Link>
                           </div>
                        )
                    })
                }
                </ul>
            </div>
        </div>
    </nav>
    </>
  )
}
