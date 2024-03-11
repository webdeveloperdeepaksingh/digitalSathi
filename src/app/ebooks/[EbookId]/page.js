import React from 'react';
import Image from 'next/image';
import AddItemToCart from '@/components/AddItemToCart/page';
import { GrDocumentNotes } from "react-icons/gr";
import NavBar from '@/components/NavBar/page';
import Footer from '@/components/Footer/page';



async function getEbookById(id){
    const res = await fetch(`http://localhost:3000/api/ebooks/${id}`);
    const ebookById = await res.json();
    return ebookById;
}

export async function generateMetadata({ params, searchParams }, parent) {
  const id = params.EbookId
  const res = await fetch(`http://localhost:3000/api/ebooks/${id}`);
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
}

export default async function EbooksLandingPage({params}) {

  const ebk = await getEbookById(params.EbookId);

  return (
    <div>
      <div className='h-[105px]'><NavBar/></div>
      <div className='grid md:grid-cols-2 w-full p-9 gap-1'>
        <div className='relative w-full h-auto'>
            <Image alt={ebk.result.prodName} src={`/images/${ebk.result.prodImage}`} width={700} height={900} />
        </div>
        <div className='relative'  >
          <h1 className='uppercase p-2 text-2xl font-bold bg-gray-200'>{ebk.result.prodName}</h1>
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
          <div className='grid grid-cols-1 w-full gap-1 mt-3'>
            <AddItemToCart prodId={ebk.result}/>
          </div>
        </div>
      </div>
      <div className='px-9'>
        <div className='bg-gray-200 '>
            <h1 className='p-3 text-3xl font-bold text-center uppercase'>Ebook Contents</h1>
        </div>
        <div className="w-full  mx-auto">
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
