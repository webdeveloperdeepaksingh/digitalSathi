'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { CgProfile } from "react-icons/cg";
import Cookies from 'js-cookie';
import { RiLockPasswordFill } from "react-icons/ri";
import { MdManageAccounts, MdOutlineExitToApp } from "react-icons/md";
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';

export default function SideMenu({isShown, params}) {

   const [profile, setProfile] = useState('');
   const {loggedInUser} = useContext(UserContext);
   const router = useRouter();

   useEffect(()=>{
        async function fetchProfile(){
            const res = await fetch('http://localhost:3000/api/profile');
            const profiles = await res.json();
            const profileById = profiles.filter(profile => profile.userId === loggedInUser.result?._id);
            setProfile(profileById[0]);
        }
        fetchProfile();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[]) 

   if(!isShown) return null;

   const handleLogOut = () =>{
   const token = Cookies.get('token');

	if (token) {
		try {
			Cookies.remove('token');    
		} catch (_) {}
	}
    
    toast('Logged out successfully!', {
        hideProgressBar: false,
        autoClose: 2000,
        type: 'success'
        });
    router.push("/login");
}

  return (
    <div>
    <div className='flex bg-white flex-col w-[240px]'>
        <ul className='block divide-y shadow-lg border border-solid p-3 w-[240px]'>
            <li className='group hover:bg-amber-500 px-3 flex items-center rounded-sm '>
                <span className='text-2xl group-hover:text-white '><CgProfile/></span>
                <Link href={`/dashboard/profile/${profile._id}`} className='p-2 group-hover:text-white' >Profile Settings</Link>
            </li>
            <li className='group hover:bg-amber-500 px-3 flex items-center rounded-sm '>
                <span className='text-2xl group-hover:text-white'><MdManageAccounts/></span>
                <Link href={`/dashboard/account/${loggedInUser.result._id}`} className='p-2 group-hover:text-white'>Account Settings</Link>
            </li>
            <li className='group hover:bg-amber-500 px-3 flex items-center rounded-sm '>
                <span className='text-2xl group-hover:text-white'><RiLockPasswordFill /></span>
                <Link href={`/dashboard/changepassword/${loggedInUser.result?._id}`} className='p-2 group-hover:text-white'>Change Password</Link>
            </li>
            <li className='group hover:bg-amber-500 px-3 flex items-center rounded-sm '>
                <div className='flex items-center'>
                    <span className='text-2xl group-hover:text-white'><MdOutlineExitToApp /></span>
                    <button type='button'  onClick={handleLogOut} className='p-2 group-hover:text-white'>Sign Out</button>
                </div>
            </li>
        </ul>
        </div>
    </div>
  )
}
