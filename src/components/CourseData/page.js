'use client';
import React, { useState, useEffect } from 'react';

export default function CourseData() {

    const [courses, setCourses] = useState('');
    useEffect(() =>{
        async function fetchData(){
        let coData = await fetch('http://localhost:3000/api/courses');
        coData = await coData.json();
        setCourses(coData);
       }
       fetchData();
    })

  return (
    <div>
      
    </div>
  )
}
