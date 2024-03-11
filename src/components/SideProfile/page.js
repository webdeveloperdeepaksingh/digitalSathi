'use client';
import Image from 'next/image';
import { IoIosArrowDown } from "react-icons/io";
import Loading from './loading';
import Cookies from 'js-cookie';
import SideMenu from '../SideMenu/page';
import { BASE_API_URL } from '../../../utils/constants';
import { useState, useEffect } from 'react';
import React from 'react';

export default function SideProfile() {

    const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"), usrRole:Cookies.get("loggedInUserRole")}};
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState('');
    const [toggle, setToggle] = useState(false);

    const handleToggle = () => {
        setToggle(!toggle);
    }

    useEffect(()=>{
        async function fetchProfile(){
        try 
        {
            const res = await fetch(`${BASE_API_URL}/api/profile`);
            if(!res.ok){
                throw new Error("Error fetching profile data.");
            }
            const profiles = await res.json();
            const profileById = profiles.filter(profile => profile.userId === loggedInUser?.result?._id);
            setProfile(profileById[0]);
    
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally{
            setIsLoading(false);
        }  
        }
        fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]) 

    if(isLoading){
        return <div>
            <Loading/>
        </div>
    }

  return (
    <div>
      <header className=' flex h-[100px] p-4 items-center w-full justify-end bg-white shadow-lg'>
        <div className='relative w-[auto]'>
            <div className='flex items-center p-3 font-bold rounded-md border border-solid border-amber-500'>
                <p className=''>Welcome {profile?.proName} !</p>
                <Image alt={profile?.proName} className='rounded-sm mx-2'  src={`/images/${profile?.proImage}`} width={65} height={65} />
                <div className=''>
                    <button className={ toggle == true ? 'rotate-180 duration-500' : 'duration-500'}  onClick={handleToggle}><IoIosArrowDown /></button>
                </div>
            </div>
            <div className='absolute bottom-[-180px] right-4 z-100'>
                <SideMenu  isShown={toggle}/>
            </div>    
        </div>
    </header>
    </div>
  )
}
