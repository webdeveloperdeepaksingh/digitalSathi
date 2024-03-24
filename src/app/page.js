import Footer from '@/components/Footer/page'
import { BASE_API_URL } from '../../utils/constants';
import Banner from '../../public/images/bnr.jpg';
import webDev from '../../public/images/webDevelopment.jpg';
import webDes from '../../public/images/webDesign.jpg';
import webSeo from '../../public/images/seoService.jpg';
import aboutD from '../../public/images/AboutDigitalSathi.jpeg';
import devTrain from '../../public/images/trainingNDevelopment.jpg';
import Image from 'next/image';
import Link from 'next/link';
 
export async function generateMetadata({ params, searchParams }, parent) {
try 
  {
      const _id = "65c8e1dad3c601a36e0dd62f";
      const res = await fetch(`${BASE_API_URL}/api/settings/${_id}`);
      const meta = await res.json();
      const previousImages = (await parent).openGraph?.images || [];
      return {
          title: meta.result.brandTitle,
          description: meta.result.brandIntro,
          keywords: [meta.result.brandTags],
          icons: {
              icon: meta.result.brandIcon, // Path to your favicon.ico
          },
          openGraph: {
              images: [meta.result.brandBanner, ...previousImages] // Helps sharing of webpages on social media.
          },
          // alternates:{
          //   canonical:`https://`
          //    languages:{
          //      "en-US"
          //    }
          // }
      };
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
      <div className='flex flex-col w-full px-12 mt-4'>
          <div className='flex flex-col'>
            <hi className='text-center text-3xl font-bold'>ABOUT US</hi>
            
              <div className='grid grid-cols-1 md:grid-cols-2' >
                <div className='w-auto h-auto shadow-xl p-6 '>
                  <Image alt='web_development' className='h-[400px] w-[680px]' src={aboutD} width={650} height={650} />
                </div>
                <div className='p-9 text-center mt-9'>
                  <p>
                      At DigitalSathi, we don’t just build websites; we weave digital dreams. Our journey began in a cozy garage, fueled by passion and a shared vision: to create online experiences that resonate with users, businesses, and brands alike. Your success is our compass. We listen, collaborate, and tailor solutions to fit your unique needs. Our clients aren’t just projects; they’re partners on this exhilarating ride. <br/><br/>
                      At DigitalSathi, we don’t just build websites; we weave digital dreams. Our journey began in a cozy garage, fueled by passion and a shared vision: to create online experiences that resonate with users, businesses, and brands alike. Your success is our compass. We listen, collaborate, and tailor solutions to fit your unique needs. Our clients aren’t just projects; they’re partners on this exhilarating ride.<br/><br/>
                  </p>
                </div>
              </div>
           
          </div>
          <div className='flex flex-col mt-6'>
              <h1 className='text-center text-3xl font-bold'>SERVICES WE OFFER</h1>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                  <div className='w-auto h-auto shadow-xl p-6'>
                    <Image alt='web_development' src={webDev} width={400} height={400} />
                    <p className='mt-3 text-center text-xl font-bold'>Web Development</p>
                  </div>
                  <div className='w-auto h-auto shadow-xl p-6'>
                    <Image alt='web_design' src={webDes} width={400} height={400} />
                    <p className='mt-3 text-center text-xl font-bold'>Web Designing</p>
                  </div>
                  <div className='w-auto h-auto shadow-xl p-6'>
                    <Image alt='web_seo' src={webSeo} width={400} height={400} />
                    <p className='mt-3 text-center text-xl font-bold'>Web SEO</p>
                  </div>
                  <div className='w-auto h-auto shadow-xl p-6'>
                    <Image alt='trainingNdevelopment' src={devTrain} width={400} height={400} />
                    <p className='mt-3 text-center text-xl font-bold'>Skills Training</p>
                  </div>
              </div>
          </div>
      </div>
      
      <Footer/>
    </main>
  )
}
