'use client'
import Footer from '@/components/Footer/page';
import NavBar from '@/components/NavBar/page';
import InnerBanner from '../../../public/images/inrbnr.jpg';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function OnlineEbooks() { 

  const [ebookList, setEbookList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(()=>{
    async function fetchCatList(){
      const res = await fetch('http://localhost:3000/api/categories');
      const catList = await res.json();
      setCatList(catList)
    }
    fetchCatList();
  },[])

  useEffect(()=>{
    async function fetchEbookList(){
      let api = '';
      if(query != ''){
        api = `http://localhost:3000/api/onlineebooks?query=${query}`
      }else{
        api = 'http://localhost:3000/api/onlineebooks'
      }
      const res = await fetch(api);
      const ebookList = await res.json();
      setEbookList(ebookList);
      console.log(ebookList);
    }
    fetchEbookList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[query])
  
  const handleChange =(event) =>{
    setQuery(event.target.value);
    console.log(event.target.value);
  }

  return (
    <div>
       <div className='h-[90px]'>
        <NavBar/>
      </div>
      <div className='w-full h-auto'>
        <Image alt='innerBanner' src={InnerBanner} width={1540} height={400}></Image>
      </div>
      <h1 className='text-center font-bold my-6 text-3xl '>EBOOKS</h1>
      <div className='flex flex-col gap-6'>
      <div className='flex flex-col px-12 max-w-[430px]'>
          <select type='select' name='prodCat'  onChange={handleChange} className='p-3 border-2 border-amber-600 font-bold focus:outline-amber-600 text-xl text-center rounded-md'>
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
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-12 mb-9'>
        {
          ebookList.map((ebk) =>{
            return(
              <div key={ebk._id} className='relative flex flex-col max-w-[350px] p-6 rounded-lg shadow-xl  hover:scale-110 duration-700'>
                  <Image className='rounded-sm' alt={ebk.prodName} src={`/images/${ebk.prodImage}`} width={300} height={250}/>
                  <h3 className='py-2 text-xl uppercase font-bold border-b-2 border-amber-600'>{ebk.prodName}</h3>
                  <p className='text-justify py-2'>{ebk.prodIntro}</p>
                  <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-1'>
                      <button className='py-2 px-3 rounded-sm text-white font-bold bg-amber-600 hover:bg-amber-500'>Learn More</button>
                      <button className='py-2 px-3 rounded-sm text-white font-bold bg-gray-600 hover:bg-gray-500'>Add to Cart</button>
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
  </div>
  )
}
