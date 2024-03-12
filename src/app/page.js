import Footer from '@/components/Footer/page'
import { BASE_API_URL } from '../../utils/constants';
import Banner from '../../public/images/bnr.jpg';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({ params, searchParams }, parent) {
try 
  {
    const _id = "65c8e1dad3c601a36e0dd62f"
    const res = await fetch(`${BASE_API_URL}/api/settings/${_id}`);
    const meta = await res.json();
    // const previousImages = (await parent).openGraph?.images || []
    return {
      title: meta.result.brandTitle,
      description: meta.result.brandIntro,
      keywords: [meta.result.brandTags],
      icons: {
        icon: `/images/${meta.result.brandIcon}`, // Path to your favicon.ico
      }    
      // openGraph: {
      //   images: [`/${meta.result.prodImage}`, ...previousImages], //helps sharing of webpages on social media.
      // },
    }
  } catch (error) {
    console.error("Error fetching settData: ", error);
  }
  
}

export default function HomePage() {
  if(!BASE_API_URL){
    return null; //must be written to deploy successfully.
  }
  
  return (
    <main >
      <div className='h-[86px]'></div>
      <div className='relative h-auto w-auto '>
        <Image alt='banner'  src={Banner} width={1520} height={800} priority/>
        <div className='absolute flex flex-col top-24 md:top-60 mx-5 w-auto'>
          <h1 className=' text-xl md:text-6xl font-bold text-yellow-400'>Expand your</h1>
          <h1 className='text-xl md:text-6xl  font-bold text-yellow-400'>business with us...!</h1>
          <p className='hidden md:block text-white mt-2'>Web & App development and training services. Explore our e-training</p>
          <p className='hidden md:block text-white mt-2'>courses developed by experienced industry experts.</p>
          <div className='flex gap-1 mt-2'>
              <Link href='/signup' className='px-2 py-2 font-bold text-white bg-amber-500 hover:bg-amber-400 text-center rounded-sm'>SIGN UP</Link>
              <Link href='/courses' className='px-2 py-2 font-bold  text-black bg-gray-300 hover:bg-gray-100 text-center rounded-sm'>EXPLORE COURSES</Link>
          </div>
        </div>
      </div>
      
      <div className='flex flex-col w-full '>
          
      </div>
      
      <Footer/>
    </main>
  )
}
