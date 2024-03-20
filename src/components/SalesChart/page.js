"use client";
import React from 'react';
import { Bar } from 'react-chartjs-2';
import  {useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import { BASE_API_URL } from '../../../utils/constants';
import Loading from './loading';

import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend
);

export default function SalesChart() {

  const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
  const [chartData, setChartData] = useState({datasets:[],});
  const [isLoading, setIsLoading] =  useState(true);
  const [chartOptions, setChartOptions] = useState({});
  const [salesData, setSalesData] = useState([]);

  useEffect(()=>{
    async function fetchSalesData(){
    try 
        {
            const res = await fetch(`${BASE_API_URL}/api/sales?userId=${loggedInUser.result._id}`, {cache: "no-store"});
            if(!res.ok){
                throw new Error("Error fetching sales data.");
            }
            const salesData = await res.json();
            setSalesData(salesData);
            console.log(salesData);
        } catch (error) {
            console.error("Error fetching sales data: ", error);
        }finally {
            setIsLoading(false);
        }
    }
  fetchSalesData();
  }, [loggedInUser.result._id])
  

  useEffect(()=>{
    const options = { month: 'long' };
    const labels = salesData.map((item) => new Intl.DateTimeFormat('en-US', options).format(new Date(item.createdAt)));
    const uniqueLabels = [...new Set(labels)];
    

    const productCourseValues = salesData.reduce((acc, item) => {
        if (item.custProducts.some((product) => product.prodType === "courses")) {
        const month = new Intl.DateTimeFormat('en-US', options).format(new Date(item.createdAt));
          acc[month] = (acc[month] || 0) + item.custProducts.filter((product) => product.prodType === "courses").reduce((acc1, product1) => acc1 + product1.prodValue, 0);
        }
        return acc;
      }, {});

      const productEventValues = salesData.reduce((acc, item) => {
        if (item.custProducts.some((product) => product.prodType === "events")) {
          const month = new Intl.DateTimeFormat('en-US', options).format(new Date(item.createdAt));
          acc[month] = (acc[month] || 0) + item.custProducts.filter((product) => product.prodType === "events").reduce((acc1, product1) => acc1 + product1.prodValue, 0);
        }
        return acc;
      }, {});

      const productEbookValues = salesData.reduce((acc, item) => {
        if (item.custProducts.some((product) => product.prodType === "ebooks")) {
          const month = new Intl.DateTimeFormat('en-US', options).format(new Date(item.createdAt));
          acc[month] = (acc[month] || 0) + item.custProducts.filter((product) => product.prodType === "ebooks").reduce((acc1, product1) => acc1 + product1.prodValue, 0);
        }
        return acc;
      }, {});

    setChartData({
        labels:uniqueLabels,
        datasets:[
            {
                label: 'Courses',
                data: productCourseValues,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: 'Events',
                data: productEventValues,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
                label: 'Ebooks',
                data: productEbookValues,
                backgroundColor: 'rgba(150, 80, 192, 0.6)',
            }
        ]
    })
    setChartOptions({
        plugins:{
            legend:{
                position: 'top',
            },
            title:{
                display: true,
                text: '[ ANNUAL SALES REPORT ]'
            }
        },
        maintainAspectRatio: false,
        responsive:true
    })
  },[salesData])

  if(isLoading){
    return<div><Loading/></div>
  }

  return (
    <div>
       <div className='lg:h-[70vh] h-[50vh] p-9'>
            <Bar data={chartData} options={chartOptions} />
       </div>
    </div>
  )
}
