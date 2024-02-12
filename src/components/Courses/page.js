'use client'
import Footer from '@/components/Footer/page';
import NavBar from '@/components/NavBar/page';
import InnerBanner from '../../../public/images/inrbnr.jpg';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/slices/cartSlice';

export default function OnlineCourses() { 

  const [productList, setProductList] = useState([]);
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
    async function fetchCourseList(){
      let api = '';
      if(query != ''){
        api = `http://localhost:3000/api/onlinecourses?query=${query}`
      }else{
        api = 'http://localhost:3000/api/onlinecourses'
      }
      const res = await fetch(api);
      const productList = await res.json();
      setProductList(productList);
      console.log(productList);
    }
    fetchCourseList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[query])
  
  const handleChange =(event) =>{
    setQuery(event.target.value);
    console.log(event.target.value);
  }

  const dispatch = useDispatch();
  const handleAddToCart = (courseData) =>{
    dispatch(addToCart(courseData)); //calling addToCart reducer.
  }

  return (
    <div>
       <div className='h-[90px]'>
        <NavBar/>
      </div>
      <div className='w-full h-auto'>
        <Image alt='innerBanner' src={InnerBanner} width={1540} height={400}></Image>
      </div>
      <h1 className='text-center font-bold my-6 text-3xl '>ONLINE COURSES</h1>
      <div className='flex flex-col gap-6'>
      <div className='flex flex-col px-12 max-w-[430px] '>
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
          productList.map((prod) =>{
            return(
              <div key={prod._id} className='relative flex flex-col max-w-[350px] p-6 rounded-md shadow-xl  hover:scale-110 duration-700'>
                  <Image className='rounded-sm' alt={prod.prodName} src={`/images/${prod.prodImage}`} width={300} height={250}/>
                  <h3 className='py-2 text-xl uppercase font-bold border-b-2 border-amber-600'>{prod.prodName}</h3>
                  <p className='text-justify py-2'>{prod.prodIntro}</p>
                  <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-1'>
                      <Link href={`/courses/${prod._id}`} className='py-2 px-3 text-center rounded-sm text-white font-bold bg-amber-600 hover:bg-amber-500'>Learn More</Link>
                      <button type='button' onClick={()=>handleAddToCart(prod)} className='py-2 px-3 rounded-sm text-white font-bold bg-gray-600 hover:bg-gray-500'>Add to Cart</button>
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
