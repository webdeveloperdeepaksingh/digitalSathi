'use client';
import Footer from '@/components/Footer/page';
import InnerBanner from '../../../public/images/inrbnr.jpg';
import { BASE_API_URL } from '../../../utils/constants';
import Link from 'next/link';
import Image from 'next/image';
import Loading from './loading';
import { useEffect, useState } from 'react';

export default function OnlineBlogs() { 

  const [isLoading, setIsLoading] = useState(true);
  const [blogList, setBlogList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(()=>{
    async function fetchCatList(){
    try 
      {
        const res = await fetch(`${BASE_API_URL}/api/categories`);
        const catList = await res.json();
        setCatList(catList)
      } catch (error) {
        console.error("Error fetching category data. :", error);
      }
    }
    fetchCatList();
  },[])

  useEffect(()=>{
    async function fetchBlogList(){
      let api = '';
      if(query != ''){
        api = `${BASE_API_URL}/api/onlineblogs?query=${query}`
      }else{
        api = `${BASE_API_URL}/api/onlineblogs`
      }
      try 
      {
        const res = await fetch(api);
        if(!res.ok){
          throw new Error("Error fetching blog data.");
        }
        const blogList = await res.json();
        setBlogList(blogList);
      } catch (error) {
        console.error("Error fetching data. :", error);
      }finally{
        setIsLoading(false);
      }
    }
    fetchBlogList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[query])
  
  const handleChange =(event) =>{
    setQuery(event.target.value);
    console.log(event.target.value);
  }

  if(isLoading){
    return <div><Loading/></div>
  }
  
  return (
    <>
    <div className='h-[88px]'></div>
    <title>DigitalSathi | Blogs </title>
    <Image alt='innerBanner' src={InnerBanner} width={1540} height={400}></Image>
    <h1 className='text-center font-bold my-6 text-3xl '>ONLINE BLOGS</h1>
    <div className='flex flex-col gap-6'>
    <div className='flex flex-col px-12 max-w-[430px]'>
        <select type='select' name='coCat'  onChange={handleChange} className='p-3 border-2 border-amber-600 font-bold focus:outline-amber-500 text-xl text-center rounded-md'>
          <option value=''> --- Choose Category --- </option>
          {
            catList.map((cat) => {
              return(
                <option className='text-left' value={cat.catName} key={cat._id}>{cat.catName}</option>
              )
            })
          }
        </select>
      </div>
      <div className='grid h-auto grid-cols-1 md:grid-cols-3 lg:grid-cols-4 px-12 gap-6'>
      {
        blogList.map((blg) =>{
          return(
            <div key={blg._id} className='flex flex-col w-auto h-auto p-6 rounded-md shadow-xl  hover:scale-110 duration-700 border-2 border-amber-500'>
                <Image className='rounded-sm h-[150px]' alt={blg.blgName} src={blg.blgImage} width={300} height={150} />
                <h3 className='py-2 text-xl uppercase font-bold border-b-2 border-amber-500'>{blg.blgName}</h3>
                <p className='text-justify py-2'>{blg.shortIntro}</p>
                <div className='grid grid-cols-1'>
                    <Link href={`/blogs/${blg._id}`} className='text-center py-2 px-3 rounded-sm text-white font-bold bg-amber-500 hover:bg-amber-400'>Learn More</Link>
                </div>
            </div>
          )
        })
      }
    </div>
    </div>
  <div>
  <Footer/>
  </div>
  </>
  )
}
