'use client';
import React from 'react';
import Link from 'next/link';
import { CgProfile } from "react-icons/cg";
import { MdManageAccounts, MdOutlineExitToApp } from "react-icons/md";

export default function SideMenu({isShown}) {
    
  if(!isShown) return null;


  return (
    <div>
    <div className='flex bg-white flex-col w-[222px]'>
        <ul className='block divide-y shadow-lg border border-solid p-2 w-[220px]'>
            <li className='group hover:bg-amber-500 px-3 flex items-center rounded-sm '>
                <span className='text-2xl group-hover:text-white '><CgProfile/></span>
                <Link href='/dashboard/profile/6597cbd1bdce0c3ab963f5ba' className='p-2 group-hover:text-white' >Profile Settings</Link>
            </li>
            <li className='group hover:bg-amber-500 px-3 flex items-center rounded-sm '>
                <span className='text-2xl group-hover:text-white'><MdManageAccounts/></span>
                <Link href='/dashboard/account/6592c0905f6f98bf8213a9b7' className='p-2 group-hover:text-white'>Account Settings</Link>
            </li>
            <li className='group hover:bg-amber-500 px-3 flex items-center rounded-sm '>
                <span className='text-2xl group-hover:text-white'><MdOutlineExitToApp /></span>
                <Link href='/#' className='p-2 group-hover:text-white'>Sign Out</Link>
            </li>
        </ul>
        </div>
    </div>
  )
}
