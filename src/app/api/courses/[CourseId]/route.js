import { NextResponse } from "next/server";
import connect from "../../../../../server";
import {Products} from "../../../../../models/Products";


export const GET = async (request, {params}) => {
try 
  {
    await connect ();
    const course = await Products.findById(params.CourseId);
    
    if (!course) {
        return new NextResponse("No course found with the given ID", {status: 404});
    }
    return NextResponse.json({result:course}, {status: 200});    

  }catch(error){
        return new NextResponse ("Erron while retrieving data: " + error, {status: 500});
      }
}

export const PUT = async (request, {params}) =>{
try 
  {
      const {prodName, prodTags, prodAuth, prodIntro, prodTax, prodDisct, prodDesc, prodCat, prodVal, prodPrice, prodDisc, prodImage } = await request.json();
      await connect ();
      const course = await Products.findById(params.CourseId);

      if (!course) {
      return new NextResponse("No course found with the given ID", {status: 404});
      }

   // Update the course
      Object.assign(course, {prodName, prodTags, prodAuth, prodIntro, prodTax, prodDisct,  prodDesc, prodCat, prodVal, prodPrice, prodDisc, prodImage });
      await course.save();
      return NextResponse.json({ message: 'Course updated successfully', success:true }, {status:200});

   }  catch(error){
      return new NextResponse ("Erron while updating data: " + error, {status: 500});
      }
}

export const DELETE = async (request, {params}) =>{

   try 
   {
         const courseId = params.CourseId;
         const record = {_id:courseId}
         
         await connect ();
         let posts = await Products.deleteOne(record);
         return NextResponse.json({posts, success:true}, {status:200});
   
   } catch (error) {
         return new NextResponse ("Erron while deleting data: " + error, {status: 500});
   }
}