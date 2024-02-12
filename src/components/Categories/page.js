'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Categories() {

  const [catList, setCatList] = useState([]);
  const router = useRouter();
  // const [query, setQuery] = useState({coCat:''});
 
  useEffect(()=>{
    async function fetchData(){
        const res = await fetch('http://localhost:3000/api/categories');
        const catList = await  res.json();
        setCatList(catList);
    }
    fetchData();
  },[])

//   const handleChange = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;
//     console.log(name, value);
//     setQuery((prev) =>{
//     return {
//         ...prev, [name]: value
//     }
//   }); 
//   //sendQueryToServer(query);

// router.push(`/courses?query=`)
// }
 
//  const sendQueryToServer = async (data) =>{
//   try
//     {
//       let api = '';
//       if(query != ''){
//         api = `http://localhost:3000/api/onlinecourses?query=${data}`;
//       }else{
//         api = 'http://localhost:3000/api/onlinecourses';
//       }
//       const res = await fetch(api);
//       const course = await res.json();
//       console.log(course);
//       return course;

//     }catch(error) {
//         console.log(error);
//       }
//  }
  
  return (
    <div>
      <div className='flex flex-col px-12 max-w-[420px]'>
          <select type='select' name='coCat'  onChange={(e)=>router.push(`/courses?query=${e.target.value}`)} className='p-3 border border-amber-600 font-bold focus:outline-amber-600 text-xl text-center rounded-md'>
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
    </div>
  )
}
