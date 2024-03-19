import React from 'react';
import Image from 'next/image';
import AddItemToCart from '@/components/AddItemToCart/page';
import { GrDocumentNotes } from "react-icons/gr";
import NavBar from '@/components/NavBar/page';
import Footer from '@/components/Footer/page';
import { BASE_API_URL } from '../../../../utils/constants';

async function getEbookById(id){
try 
  {
    const res = await fetch(`${BASE_API_URL}/api/ebooks/${id}`, { cache: 'no-store' });
    if(!res.ok){
      throw new Error("Error fetching ebook data");
    }
    const ebookById = await res.json();
    return ebookById;
  } catch (error) {
    console.error("Error fetching ebook data: ", error);
  }   
}

export async function generateMetadata({ params, searchParams }, parent) {
try 
  {
    const id = params.EbookId
    const res = await fetch(`${BASE_API_URL}/api/ebooks/${id}`);
    if(!res.ok){
      throw new Error("Error fetching ebook data");
    }
    const meta = await res.json();
  // const previousImages = (await parent).openGraph?.images || []
    return {
    title: meta.result.prodName,
    description: meta.result.prodIntro,
    keywords: [meta.result.prodTags],
    // openGraph: {
    //   images: [`/${meta.result.prodImage}`, ...previousImages],
    // },
  }
  } catch (error) {
    console.error("Error fetching ebookData: ", error);
  }
}

export default async function EbooksLandingPage({params}) {

  if(!BASE_API_URL){
    return null; //must be written to deploy successfully.
  }
  const ebk = await getEbookById(params.EbookId);

  return (
    <div>
      <div className='h-[90px]'><NavBar/></div>
      <div className='md:flex w-full p-9 gap-9'>
        <Image className='mb-9 md:mb-0' alt={ebk.result.prodName} src={ebk.result.prodImage} width={583} height={600} />
        <div className='w-full p-9 border border-solid border-amber-500 rounded-md'>
          <h1 className='uppercase p-3 text-2xl font-bold bg-gray-200 rounded-md'>{ebk.result.prodName}</h1>
          <p className='text-justify p-2'>{ebk.result.prodIntro}</p>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Ebook Author</p>
            </div>
            <div>
                <p>{ebk.result.prodAuth}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Original Price</p>
            </div>
            <div>
                <p>{ebk.result.prodPrice}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Discounted Price</p>
            </div>
            <div>
                <p>{ebk.result.prodDisc}</p>
            </div>
          </div>
          <div className='grid md:grid-cols-2 w-full px-2'>
            <div>
                <p className='font-semibold uppercase'>Ebook Category</p>
            </div>
            <div>
                <p>{ebk.result.prodCat}</p>
            </div>
          </div>
          <div className='grid grid-cols-1 w-full gap-1 my-3'>
            <AddItemToCart prodId={ebk.result}/>
          </div>
          {/* <div className='bg-gray-200 rounded-md'>
            <h1 className='uppercase p-3 text-2xl font-bold bg-gray-200 rounded-md'>Ebook Description</h1>
          </div>
          <div className='text-left p-6'>
            <div dangerouslySetInnerHTML={{__html:ebk.result.prodDesc}}></div>   
          </div> */}
        </div>
      </div>
      <div className='flex flex-col px-9 '>
        <div className="flex flex-col p-9 border border-solid border-amber-500 rounded-lg w-full mx-auto">
          <div className='bg-gray-200 mb-3'>
              <h1 className='p-3 text-3xl font-bold text-center uppercase'>Ebook Contents</h1>
          </div>
          {
            ebk.result.chapters.map((chapter, index) => 
            (
              <details key={index} className="border-b border-gray-200">
                <summary className="px-4 py-2 hover:bg-gray-100 cursor-pointer uppercase">
                  {chapter.chapName}
                </summary>
                <div className="bg-white">
                  {chapter.topics.map((topic, i) => (
                    <p key={i} className="px-9 py-2 border-t flex items-center">
                      <GrDocumentNotes className='mr-3' />{topic.topName}
                    </p>
                  ))}
                </div>
              </details>
            ))
          }
        </div>
      </div>
      <Footer/>
    </div>
  )
}
