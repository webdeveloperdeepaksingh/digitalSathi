import Footer from '@/components/Footer/page';
import NavBar from '@/components/NavBar/page';
import InnerBanner from '../../../public/images/inrbnr.jpg';
import Link from 'next/link';
import Image from 'next/image';

async function getEventData(){
  const res = await fetch('http://localhost:3000/api/events');
  const event = await res.json();
  return event;
}

export default async function Events() {  

  const event = await getEventData();

  return (
    <div>
       <div className='h-[90px]'>
        <NavBar/>
      </div>
      <div className='w-full h-auto'>
        <Image alt='innerBanner' src={InnerBanner} width={1540} height={400}></Image>
      </div>
      <h1 className='text-center font-bold my-6 text-3xl '>UPCOMING EVENTS</h1>
      <div className='grid  md:grid-cols-2 lg:grid-cols-4 px-12  w-full  gap-9 mb-24'>
        {
          event.map((evt) =>{
            return (
              <div key={evt._id} className='flex w-[330px] p-5  bg-white border border-solid border-amber-600 rounded-lg justify-center items-center hover:scale-110 duration-700'>
                  <div className='flex flex-col'>
                    <div className='w-auto'>
                      <Image className='rounded-lg' alt={evt.evtName} src={`/images/${evt.evtImage}`} width={300} height={250} objectFit='cover'/>
                    </div>
                    <div>
                      <p className='py-2 border-b-2 border-amber-500  uppercase text-lg font-bold'>{evt.evtName}</p>
                      <p className='py-2  text-lg '>{evt.shortIntro}</p>
                    </div>
                    <div className='grid grid-cols-1 gap-1 w-full'>
                      <button className='font-bold py-2 rounded-sm px-1 bg-amber-600 hover:bg-amber-500 text-white'><Link href={`/events/${evt._id}`}>Read More</Link></button>
                    </div>
                  </div>
              </div>
            )})
        }
      </div>
      <div>
        <Footer/>
     </div>
    </div>
  )
}
