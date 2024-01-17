'use client';
import { usePathname } from 'next/navigation';
import logo from '../../../public/images/logo.png';
import { FaCartPlus } from "react-icons/fa6";
import {AiOutlineClose, AiOutlineMenu} from 'react-icons/ai';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

export default function NavBar() {

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

  return (
    <div className='p-0'>
      <div className='w-full '>
        <nav className='w-full shadow-lg bg-white px-5 fixed z-50 mx-auto py-1 flex justify-between items-center'>
            <Image alt='digitalsathi' src={logo} height={60} width={220}/>
            <ul className='hidden md:flex gap-5 '>
                {
                    menues.map((item, i) =>{
                        return (
                            <li className={currentRoute === `${item.url}` ? "font-bold text-amber-600" : ""} key={i}>
                                <Link href={item.url}>{item.name}</Link>
                            </li>
                        )
                    })
                }
            </ul>
            <div className='flex  items-center'>
                <Link href='/shoppingcart'><FaCartPlus className='mx-3 text-2xl text-amber-600 cursor-pointer'/></Link>
                <Link href='/login' className='py-2 px-3 hover:bg-amber-500 bg-amber-600 font-bold text-white'>LOGIN</Link>
            </div>
            <div onClick={handleMenuToggle} className='flex md:hidden'>
                {menuIcon ?
                  (<AiOutlineClose className='text-4xl mx-3 shadow-lg p-2 cursor-pointer'/>)
                  :
                  (<AiOutlineMenu className='text-4xl mx-3 shadow-lg p-2 cursor-pointer'/>)
                }
            </div>
            <div className={menuIcon ?
                'md:hidden absolute top-[95px] right-0 bottom-0 left-0 flex justify-center items-center text-center w-full h-[50vh] bg-amber-600 text-white case-in duration-700'
                :
                'md:hidden absolute top-[95px] right-0 bottom-0 left-[-100%] flex justify-center items-center text-center w-full h-[50vh] bg-amber-600 text-white case-in duration-700'
              }>
                <div className='w-full'>
                    <ul className='font-bold text-md px-5'>
                    {
                        menues.map((item, i) =>{
                            return (
                                <li onClick={handleMenuToggle} className='py-2 hover:text-black hover:bg-white cursor-pointer' key={i}>
                                    <Link href={item.url}>{item.name}</Link>
                                </li>
                            )
                        })
                    }
                    </ul>
                </div>
            </div>
        </nav>
      </div>
    </div>
  )
}
