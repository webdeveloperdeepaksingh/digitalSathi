import Footer from '@/components/Footer/page'
import NavBar from '@/components/NavBar/page'
import Banner from '../../public/images/bnr.jpg';
import Image from 'next/image';
import Link from 'next/link';


export default function Home() {
  return (
    <main >
      <div className='h-[90px]'><NavBar/></div>
      <div className='relative h-auto  '>
        <Image alt='banner' className='w-full' src={Banner} width={1520} height={800}></Image>
        <div className='absolute flex flex-col top-24 md:top-60 mx-5 w-auto'>
          <h1 className=' text-xl md:text-6xl font-bold text-yellow-400'>Expand your</h1>
          <h1 className='text-xl md:text-6xl  font-bold text-yellow-400'>business with us...!</h1>
          <p className='hidden md:block text-white mt-2'>Web & App development and training services. Explore our e-training</p>
          <p className='hidden md:block text-white mt-2'>courses developed by experienced industry experts.</p>
          <div className='flex gap-1 mt-2'>
              <Link href='/contactus' className='px-2 py-2 font-bold text-white bg-amber-600 hover:bg-amber-500 text-center rounded-sm'>CONTACT US</Link>
              <Link href='/courses' className='px-2 py-2 font-bold  text-black bg-gray-300 hover:bg-gray-100 text-center rounded-sm'>COURSES</Link>
          </div>
        </div>
      </div>
      
      <div className='flex flex-col w-full '>
          
      </div>
      
      <Footer/>
    </main>
  )
}
