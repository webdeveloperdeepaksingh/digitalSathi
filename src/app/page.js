import Footer from '@/components/Footer/page'
import NavBar from '@/components/NavBar/page'
import Banner from '../../public/images/bnr.jpg';
import Image from 'next/image';

export default function Home() {
  return (
    <main >
      <div className='h-[90px]'>
        <NavBar/>
      </div>
      <div className='w-full h-auto'>
        <Image alt='innerBanner' src={Banner} width={1520} objectFit='cover'></Image>
      </div>
      <div className='flex flex-col w-full '>
          
      </div>
      
      <Footer/>
    </main>
  )
}
