import { NextResponse } from "next/server";
import connect from "../../../../../server";
import {Products} from "../../../../../models/Products";
import Users from "../../../../../models/Users";


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
        return new NextResponse ("Error while retrieving data: " + error, {status: 500});
      }
}

export const PUT = async (request, {params}) =>{
try 
  {
      const {prodName, prodTags, prodAuth, prodIntro, prodTax, prodDisct, prodDesc, prodCat, prodVal, prodPrice, prodDisc, prodImage, studentEmailIds, allowAccess } = await request.json();
      await connect ();
      const course = await Products.findById(params.CourseId);

      if (!course) {
            return new NextResponse("No course found with the given ID", {status: 404});
      }

      if(allowAccess === "Allowed")
      {
            for(var stu in studentEmailIds){
                  let uem = studentEmailIds[stu];
                  let user = await Users.findOne({usrEmail:uem});
                  if(user){
                        course.allowAccess.push({usrId:user._id, usrEmailId:uem});      
                  }else{
                        return NextResponse.json({ message: `No user exists with this email: ${uem}`, success: false  }, {status:404});
                  }
            }     
            Object.assign(course);
      }
      else if(allowAccess === "Disallowed"){
            for(var stu in studentEmailIds){
                  let uem=studentEmailIds[stu];
                  let user=await Users.findOne({usrEmail:uem});
                  if(user){
                        course.allowAccess.pop(user._id);      
                  }
            }   
            Object.assign(course);
      }
      else if(allowAccess !== "noaction") {
            // Update the course
            Object.assign(course, {prodName, prodTags, prodAuth, prodIntro, prodTax, prodDisct,  prodDesc, prodCat, prodVal, prodPrice, prodDisc, prodImage });
      }
   
      await course.save();
      return NextResponse.json({ message: 'Course updated successfully', success:true }, {status:200});

   }  catch(error){
      return new NextResponse ("Error while updating data: " + error, {status: 500});
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