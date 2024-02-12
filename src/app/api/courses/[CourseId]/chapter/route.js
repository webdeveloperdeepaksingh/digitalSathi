import {Products} from "../../../../../../models/Products";
import connect from "../../../../../../server";
import { NextResponse } from "next/server";

export const GET = async (request, {params}) => {

  try
  {
    await connect ();
    const course = await Products.findById(params.CourseId);

    if (!course) {
      return NextResponse("No course found with the given ID", {status: 404});
    }  
    return NextResponse.json({result:course.chapters}, {status: 200});   

  }catch(error){
    return NextResponse ("Error fetching data: " + error, {status: 500});
  }
}

export  const  POST = async (request, {params}) =>{
  
  try    
  {
    const payload = await request.json(); 
    await connect ();

    const course = await Products.findById(params.CourseId)
    course.chapters.push(payload)

    const result = await course.save();
    return NextResponse.json({result:result, success:true}, {status: 200});

  }catch(error){
      return new NextResponse ("Erron posting data: " + error, {status: 500});
    }
}