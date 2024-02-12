'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoIosArrowDown } from "react-icons/io";
import logo from '../../../public/images/logo.png';
import { IoIosPeople } from "react-icons/io";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import {BsArrowLeftShort, BsBook, BsCalendarEvent, BsQuestionSquare} from 'react-icons/bs';
import {BiCategory} from 'react-icons/bi';
import {AiOutlineHome} from 'react-icons/ai';
import { GiSettingsKnobs } from "react-icons/gi";
import {FaChalkboardTeacher, FaBlog, FaUserAlt } from 'react-icons/fa';
import Image from 'next/image';
import { FaCartPlus } from 'react-icons/fa6';
import SideMenu from '@/components/SideMenu/page';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
  
export default function DashBoard({children}) {

 const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
 const cartItems = useSelector((store) => store.cart)
 const [showMenu, setShowMenu] = useState(false);
 const [profile, setProfile] = useState('');
 
 
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

 const handleShowMenu = () => {
    setShowMenu(!showMenu);
 }

  let sideMenu = [
    
  ]

  if(loggedInUser.result?.usrRole == "ADMIN"){
    sideMenu.push(
        {
            name: showMenu == false ? 'HOME' : '',
            url:'/dashboard/home',
            icon:<AiOutlineHome/>
        },
        {
            name: showMenu == false ? 'CATEGORY' : '',
            url:'/dashboard/categorylist',
            icon:<BiCategory/>
        },
        {
            name: showMenu == false ? 'COURSES' : '',
            url:'/dashboard/courselist',
            icon:<FaChalkboardTeacher/>
        },
        {
            name: showMenu == false ? 'EBOOKS' : '',
            url:'/dashboard/ebooklist',
            icon:<BsBook/>
        },
        {
            name: showMenu == false ? 'EVENTS' : '',
            url:'/dashboard/eventlist',
            icon:<BsCalendarEvent/>
        },    
        {
            name: showMenu == false ? 'PARTICIPENTS' : '',
            url:'/dashboard/audiencelist',
            icon:<IoIosPeople/>
        },
        {
            name: showMenu == false ? 'BLOGS' : '',
            url:'/dashboard/bloglist',
            icon:<FaBlog/>
        },
        {
            name: showMenu == false ? 'REVENUE' : '',
            url:'/dashboard/saleslist',
            icon:<RiMoneyDollarBoxFill className='text-2xl' />
    
        },
        {
            name: showMenu == false ? 'ENQUIRY' : '',
            url:'/dashboard/enquirylist',
            icon:<BsQuestionSquare/>
        },
        {
            name: showMenu == false ? 'USERS' : '',
            url:'/dashboard/userlist',
            icon:<FaUserAlt/>
        },
        {
            name: showMenu == false ? 'SETTINGS' : '',
            url:'/dashboard/settings/65c8e1dad3c601a36e0dd62f',
            icon:<GiSettingsKnobs className='rotate-180'/>
        }
    );
  }

  if(loggedInUser.result?.usrRole == "INSTRUCTOR"){
    sideMenu.push(
        {
            name: showMenu == false ? 'HOME' : '',
            url:'/dashboard/home',
            icon:<AiOutlineHome/>
        },
        {
            name: showMenu == false ? 'COURSES' : '',
            url:'/dashboard/courselist',
            icon:<FaChalkboardTeacher/>
        },
        {
            name: showMenu == false ? 'EBOOKS' : '',
            url:'/dashboard/ebooklist',
            icon:<BsBook/>
        },
        {
            name: showMenu == false ? 'EVENTS' : '',
            url:'/dashboard/eventlist',
            icon:<BsCalendarEvent/>
        },
        {
            name: showMenu == false ? 'PARTICIPENTS' : '',
            url:'/dashboard/audiencelist',
            icon:<IoIosPeople/>
        },
        {
            name: showMenu == false ? 'BLOGS' : '',
            url:'/dashboard/bloglist',
            icon:<FaBlog/>
        },
        {
            name: showMenu == false ? 'REVENUE' : '',
            url:'/dashboard/saleslist',
            icon:<RiMoneyDollarBoxFill className='text-2xl' />
    
        }
    );
  }

  if(loggedInUser.result?.usrRole == "STUDENT"){
    sideMenu.push(
        {
            name: showMenu == false ? 'HOME' : '',
            url:'/dashboard/home',
            icon:<AiOutlineHome/>
        },
        {
            name: showMenu == false ? 'COURSE' : '',
            url:'/dashboard/saleslist',
            icon:<FaChalkboardTeacher/>
    
        }
    );
  }

  const [toggle, setToggle] = useState(false);
  const currentRoute = usePathname();

  const handleToggle = () => {
        setToggle(!toggle)
  }
  
  return (
    <div className='p-0'>
        <div className='flex w-full'>
            <div className={showMenu == false ? 'relative w-[80px] flex md:w-[250px] duration-500 flex-col h-screen bg-amber-600' : 'relative flex w-[80px] duration-500 flex-col h-screen bg-amber-600'}> 
                <Image className='px-2 py-2' src={logo} alt='digitalSathi'  height={100} width={250} />
                <hr/>
                <ul className='p-3'>
                {sideMenu.map((item, i) => {
                    return (
                    <li key={i} className={ currentRoute === `${item.url}` ? 'group bg-amber-500 rounded-sm  flex items-center py-2 px-2 cursor-pointer' : 'group hover:bg-amber-500 rounded-sm flex items-center py-2 px-2 cursor-pointer'} >
                        <Link href={item.url} className={ currentRoute === `${item.url}` ? 'text-black mr-2 text-2xl' : 'text-white group-hover:text-black mr-2 text-2xl'}>{item.icon}</Link>
                        <Link href={item.url} className={currentRoute === `${item.url}` ? 'hidden font-bold md:block text-black' : 'hidden font-bold md:block text-white group-hover:text-black'}>{item.name}</Link>
                    </li>
                    )
                })
                } 
                </ul>
                <span onClick={handleShowMenu} className={showMenu == false ? 'bg-white block duration-500  absolute left-[60px] md:left-[200px] top-[115px] border border-amber-600 cursor-pointer rounded-full w-[25px]' : 'bg-white rotate-180 duration-500  absolute left-[63px] top-[115px] border border-amber-600 cursor-pointer rounded-full w-[25px]'}>
                    <BsArrowLeftShort className='text-black text-2xl'/>
                </span>
            </div>
            <div className='w-full'>
                <header className=' flex h-[100px] p-4 items-center w-full justify-end bg-white shadow-lg'>
                    <div className='relative w-[auto]'>
                        <div className='flex items-center p-3 font-bold rounded-md border border-solid border-amber-600'>
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
                <main className='p-5 w-full overflow-auto h-[620px]'>
                    {children}
                </main>  
            </div>
      </div>
    </div>
  )
}
