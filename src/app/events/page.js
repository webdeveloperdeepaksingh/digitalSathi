'use client'
import Footer from '@/components/Footer/page';
import InnerBanner from '../../../public/images/inrbnr.jpg';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/slices/cartSlice';
import Loading from './loading';
import { BASE_API_URL } from '../../../utils/constants';


export default function OnlineEvents() { 

  const [isLoading, setIsLoading] = useState(true);
  const [eventList, setEventList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(()=>{
  async function fetchCatList(){
  try 
    {
      const res = await fetch(`${BASE_API_URL}/api/categories`, {cache: "no-store"});
      const catList = await res.json();
      setCatList(catList)
    } catch (error) {
      console.error("Error fetching category data. :", error);
    }
  }
  fetchCatList();
  },[])

  useEffect(()=>{
    async function fetchEventList(){
      let api = '';
      if(query != ''){
        api = `${BASE_API_URL}/api/onlineevents?query=${query}`
      }else{
        api = `${BASE_API_URL}/api/onlineevents`
      }
      try 
      {
        const res = await fetch(api , {cache:'no-store'});
        if(!res.ok){
            throw new Error("Error fetching event data.");
        }
        const eventList = await res.json();
        setEventList(eventList);
      } catch (error) {
        console.error("Error fetching data.: ", error);
      }finally{
        setIsLoading(false);
      }
    }
    fetchEventList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[query])

  const dispatch = useDispatch();
  const handleAddToCart = (eventData) =>{
    dispatch(addToCart(eventData)); //calling addToCart reducer.
  }
  
  const handleChange =(event) =>{
    setQuery(event.target.value);
    console.log(event.target.value);
  }

  if(isLoading){
    return <div><Loading/></div>
  }

  return (
    <div>
       <div className='h-[88px]'></div>
      <title>DigitalSathi | Events </title>
      <div className='w-full h-auto'>
        <Image alt='innerBanner' src={InnerBanner} width={1540} height={400}></Image>
      </div>
      <h1 className='text-center font-bold my-6 text-3xl '>UPCOMING EVENTS</h1>
      <div className='flex flex-col gap-6'>
      <div className='flex flex-col px-12 max-w-[430px]'>
          <select type='select' name='prodCat'  onChange={handleChange} className='p-3 border-2 border-amber-500 font-bold focus:outline-amber-500 text-xl text-center rounded-md'>
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
          eventList.map((evt) =>{
            return(
              <div key={evt._id} className='flex flex-col w-auto h-auto shadow-xl p-6 rounded-md  hover:scale-110 duration-700 border-2 border-amber-500'>
                  <Image className='rounded-sm h-[150px]' alt={evt.prodName} src={evt.prodImage} width={300} height={150}/>
                  <h3 className='py-2 text-xl uppercase font-bold border-b-2 border-amber-500'>{evt.prodName}</h3>
                  <p className='text-justify py-2'>{evt.prodIntro}</p>
                  <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-1'>
                      <Link href={`/events/${evt._id}`} className='text-center py-2 px-3 rounded-sm text-white font-bold bg-amber-500 hover:bg-amber-400'>Learn More</Link>
                      <button type='button' onClick={()=>handleAddToCart(evt)} className='py-2 px-3 rounded-sm text-white font-bold bg-gray-600 hover:bg-gray-500'>Add to Cart</button>
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
