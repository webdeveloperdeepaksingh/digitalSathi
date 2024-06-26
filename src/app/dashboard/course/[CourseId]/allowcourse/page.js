'use client';
import React from 'react';
import Loading from '../../loading';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { BASE_API_URL } from '../../../../../../utils/constants';
 

export default function AllowCourse({params}) {

    const loggedInUser = {result:{_id:Cookies.get("loggedInUserId"),usrRole:Cookies.get("loggedInUserRole")}};
    const [data, setData] = useState({prodId:'', prodName:'', studentId:'', shareAccess:'', allowAccess:[]});    
    const [courseData, setCourseData] = useState({allowAccess:[]});    
    const [errorMessage, setErrorMessage] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let [userEmailId, setUserEmailId] = useState([]); 
    const [email, setEmail] = useState([]); 
    const [query, setQuery] = useState('');  
    const router = useRouter();
 
    useEffect(() =>{
    async function fetchData() {  
    try 
        {
            const res = await fetch(`${BASE_API_URL}/api/courses/${params.CourseId}`, {cache: "no-store"});
            if(!res.ok){
                throw new Error("Error fetching course data.");
            }
            const course = await res.json();
            setData(course.result);   
            setCourseData(course.result);         
        } catch (error) {
            console.error("Error fetching data: ", error);
        }finally{
            setIsLoading(false);
        }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[params.CourseId]);
        

    useEffect(() =>{
        let api = '';
        if(query != ''){
        //get sales as per query entered.
        api = `${BASE_API_URL}/api/sales?userId=${loggedInUser.result._id}&query=${query}`
        }else{
        //get all sales.
        api = `${BASE_API_URL}/api/sales?userId=${loggedInUser.result._id}`
        }
        async function fetchUserEmailId() {  
        try 
        {
            const res = await fetch(api , {cache: "no-store"});
            if(!res.ok){
                throw new Error("Error fetching user email data.");
            }
            const userEmailId = await res.json();

            let userForCourses=[];

            if(userEmailId.transectionList){
                userForCourses = userEmailId.transectionList.filter((item) => {
                    return item.custProducts.some((product) => product.prodType === "courses" && product.prodId === params.CourseId );
                });
            }
            else{
                userForCourses = userEmailId.filter((item) => {
                    return item.custProducts.some((product) => product.prodType === "courses" && product.prodId === params.CourseId );
                });
            }
            
            const filteredUsers = userForCourses.filter((user) => {            
            const hasAccess = courseData.allowAccess.some((access) => access.usrEmailId === user.custEmail);
            return !hasAccess;
            });
            console.log()
            setUserEmailId(filteredUsers.map(a=>a.custEmail));
        } catch (error) {
            console.error("Error fetching data: ", error);
        }finally{
            setIsLoading(false);
        }
    }
    fetchUserEmailId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[query, courseData]);
        
        const handleSearch = (data) =>{
            setQuery(data);
        }

        const handleCheckbox = (userEmail) => {
            if (userEmail === "alluser") {
                if (email.length === userEmailId.length) {
                    // If all checkboxes are already checked, uncheck them all
                    setEmail([]);
                } else {
                    // Otherwise, check all checkboxes
                    setEmail(userEmailId);
                }
            } else {
                let userEmailIds = [...email]; // Create a copy of the email array
                if (userEmailIds.includes(userEmail)) {
                    // If the userEmail is already in the array, uncheck it
                    userEmailIds = userEmailIds.filter((id) => id !== userEmail);
                } else {
                    // Otherwise, check the userEmail
                    userEmailIds.push(userEmail);
                }
                setEmail(userEmailIds);
            }
        };        

        const handleChange = (e) => {
            const name = e.target.name;
            const value = e.target.value;
            setData((prev) =>{
            return {
                ...prev, [name]: value
            }
          }); 
        }

        const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear the previous error
         
        let errMsg = [];
    
        if (!data.shareAccess?.trim()) {
            errMsg.push('Please choose mode of access.');
        }
    
        if (errMsg.length > 0) {
            setErrorMessage(errMsg.join(' || '));
            return;
        }
        try 
        {
            const result = await fetch(`${BASE_API_URL}/api/courses/${params.CourseId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    studentEmailIds: email,
                    allowAccess: data.shareAccess,
                }),
            });
    
            const post = await result.json();
            setErrorMessage(''); // Clear the previous error
            if(post.success == false){
                if (Array.isArray(post.message)) {
                setErrorMessage(post.message.join(' || '));
                }else{
                setErrorMessage(post.message);
                }   
            }else{
                toast.success('Access allowed successfully...!', {
                    hideProgressBar: false,
                    autoClose: 1000,
                    type: 'success',
                });
                router.push('/dashboard/courselist');
            }
        } catch (error) {
            console.log(error);
        }
        };
        
        if(isLoading){
            return <div><Loading/></div>
        }
        
  return (
    <div className='flex h-auto my-1 justify-center max-w-[460px] mx-auto rounded-xl shadow-lg'>
        <form className='flex p-9 rounded-lg flex-col w-auto bg-gray-100 h-auto border-2 border-amber-500' onSubmit={handleSubmit}>
            <div className='flex flex-col mb-3'>
                <label className='font-semibold'>Course Name:</label>
                <input type='text' name='prodName' value={data?.prodName} onChange={handleChange} className='py-2 px-3 mt-2 focus:outline-amber-500'></input>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='font-semibold'>Course Id:</label>
                <input type='text' name='courseId' value={data?._id} onChange={handleChange} className='py-2 px-3 mt-2 focus:outline-amber-500'></input>
            </div>
            <div className='flex flex-col mb-1'>
                <label className='font-semibold'>Search User:</label>
                <input type='search'  onKeyUp={(e) => handleSearch(e.target.value)} placeholder='Search user email here...' className='py-2 px-3 mt-2 focus:outline-amber-500'></input>
            </div>
            <div className="h-[100px] overflow-auto">
                <table className='w-full table-fixed  text-left bg-white shadow-lg mb-3'>
                    <tbody className='divide-y'>
                        <tr className='hover:bg-gray-100'>
                            <td className='flex items-center py-2 px-3'>
                                <input type='checkbox' onChange={()=> handleCheckbox('alluser')} className='cursor-pointer' checked={email.length === userEmailId.length}></input>
                                <label className='mx-2'>Select All</label>   
                            </td>
                        </tr>
                    {
                        userEmailId.map((item)=> {
                        return(
                            
                        <tr className='hover:bg-gray-100' key={item}> 
                            <td className='flex items-center py-2 px-3'>
                                <input
                                type='checkbox'
                                onChange={() => handleCheckbox(item)}
                                className='cursor-pointer'
                                checked={email.includes(item)}
                                />        
                                <label className='mx-2'>{item}</label>   
                            </td>
                        </tr>
                            )
                        })
                    }  
                    </tbody>
                </table>
            </div>
            <div className='flex flex-col mb-3'>
                <label className='font-semibold'>Access:</label>
                <select type='select'  name='shareAccess'  value={data.shareAccess} onChange={handleChange} className='py-2 px-3 mt-2 font-bold text-center focus:outline-amber-500'>
                    <option value='noaction'>--- Choose Access ---</option>
                    <option value='Allowed' >Allowed</option>
                    <option value='Disallowed' >Disallowed</option>
                </select>
            </div>
            {errorMessage && <p className='text-red-600 italic mb-3 '>{errorMessage}</p>}
            <button type='submit' className='py-2 px-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-white font-bold'>SUBMIT</button>
      </form>
    </div>
  )
}
