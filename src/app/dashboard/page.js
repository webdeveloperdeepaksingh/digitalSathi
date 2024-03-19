'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoIosPeople } from "react-icons/io";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import {BsArrowLeftShort, BsBook, BsCalendarEvent, BsQuestionSquare} from 'react-icons/bs';
import {BiCategory} from 'react-icons/bi';
import {AiOutlineHome} from 'react-icons/ai';
import { GiSettingsKnobs } from "react-icons/gi";
import { BASE_API_URL } from '../../../utils/constants';
import {FaChalkboardTeacher, FaBlog, FaUserAlt } from 'react-icons/fa';
import Image from 'next/image';
import Cookies from 'js-cookie';
import Loading from './loading';  
import SideProfile from '@/components/SideProfile/page';


export default function DashBoard({children}) {
 const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"), usrRole:Cookies.get("loggedInUserRole")}};
 const [isLoading, setIsLoading] = useState(true);
 const [showMenu, setShowMenu] = useState(false);
 const [logo, setLogo] = useState('');
 const currentRoute = usePathname();
 const settId = "65c8e1dad3c601a36e0dd62f" 

useEffect(()=>{
async function fetchSettings(){
    try 
    {
        const res = await fetch(`${BASE_API_URL}/api/settings/${settId}`, {cache: "no-store"});
        if(!res.ok){
            throw new Error("Error fetching settData.");
        }
        const logoImage = await res.json();
        setLogo(logoImage.result);

    } catch (error) {
        console.error("Error fetching data: ", error);
    } finally{
        setIsLoading(false);
    }  
}
fetchSettings();
// eslint-disable-next-line react-hooks/exhaustive-deps
},[settId, logo]) 

const handleShowMenu = () => {
    setShowMenu(!showMenu);
 }

  if(isLoading){
    return<div><Loading/></div>
  }

  let sideMenu = []

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
            icon:<RiMoneyDollarBoxFill className='text-3xl' />
    
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
            name: showMenu == false ? 'MY COURSES' : '',
            url:'/dashboard/mycourses',
            icon:<FaChalkboardTeacher/>
        },
        {
            name: showMenu == false ? 'MY EBOOKS' : '',
            url:'/dashboard/myebooks',
            icon:<BsBook/>
        },
        {
            name: showMenu == false ? 'MY EVENTS' : '',
            url:'/dashboard/myevents',
            icon:<BsCalendarEvent/>
        }
    );
  }
  
  return (
    <div className='p-0' suppressHydrationWarning>
        <div className='flex w-full'>
            <div className={showMenu == false ? 'relative w-[80px] flex md:w-[250px] duration-500 flex-col h-screen bg-amber-500' : 'relative flex w-[80px] duration-500 flex-col h-screen bg-amber-500'}> 
                <Image className='py-2' src={logo.brandLogo} alt={logo.brandTitle}  height={100} width={250} />
                <hr/>
                <ul className='my-3'>
                {sideMenu.map((item, i) => {
                    return (
                    <Link key={i} href={item.url} className={ currentRoute === `${item.url}` ? 'flex items-center gap-2 py-2 px-5 group bg-white  cursor-pointer' : 'flex items-center gap-2 py-2 px-5 group hover:bg-white  cursor-pointer'} >  
                        <span className={ currentRoute === `${item.url}` ? 'text-black text-2xl ' : 'text-white group-hover:text-black  text-2xl'}>{item.icon}</span>
                        <p  className={currentRoute === `${item.url}` ? 'hidden font-bold md:block text-black' : 'hidden font-bold md:block text-white group-hover:text-black'}>{item.name}</p>  
                    </Link>
                    )
                })
                } 
                </ul>
                <span onClick={handleShowMenu} className={showMenu === false ? 'bg-white block duration-500  absolute left-[60px] md:left-[200px] top-[120px] border border-amber-500 cursor-pointer rounded-full w-[25px]' : 'bg-white rotate-180 duration-500  absolute left-[63px] top-[115px] border border-amber-500 cursor-pointer rounded-full w-[25px]'}>
                    <BsArrowLeftShort className='text-black text-2xl'/>
                </span>
            </div>
            <div className='w-full'>
                <SideProfile/>
                <main className='p-5 w-full overflow-auto h-[595px]'>
                    {children}
                </main>  
            </div>
      </div>
    </div>
  )
}
