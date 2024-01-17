// 'use client';
// import React from 'react';
// import { useState } from 'react';
// import { IoIosArrowDown } from 'react-icons/io';

// export default function ToggleButton() {

//     const [toggle, setToggle] = useState(false);

//     const handleToggle = (index) => { 
//         if(toggle === index){
//             setToggle(null); 
//         } else {
//             setToggle(index);
//         }
//     }

//   return (
//     <div>
//         chap?.map((index) => {
//         return (
//             <>
//             <div key={index}  onClick={() => handleToggle(index)} className={toggle === index ? ' relative bg-gray-200 flex items-center mb-1 text-lg hover:bg-gray-100 rounded-sm border border-solid mx-5 font-bold cursor-pointer' : 'relative flex bg-gray-200 items-center mb-1 text-lg hover:bg-gray-100 rounded-sm border border-solid mx-5 font-bold cursor-pointer'}>
//                 <h1 className='uppercase p-2'>{ch.chapName}</h1>
//                 <div className='flex items-center p-0'>
//                     <span className={toggle === index ? 'absolute rotate-180 duration-500 top-3 right-3 text-2xl text-amber-600' : 'absolute duration-500 top-3 right-3 text-2xl text-amber-600'}><IoIosArrowDown/></span>
//                 </div> 
//             </div>   
//             {
//                 ch.topics?.map((tp, tpIndex) => {
//                 return (
//                     <>
//                     <div className={ toggle === index ? 'flex  relative  hover:bg-gray-100 border border-solid mx-5 mb-1' : 'hidden' }>
//                         <p className='p-2'>{tp.topName}</p> 
//                     </div>
//                 </>
//             ) } ) }                                           
//         </>)})
//                 }
//     </div>
//   )
// }
