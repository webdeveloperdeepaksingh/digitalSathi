import { NextResponse } from "next/server";
import connect from "../../../../../server";
import { Courses } from "../../../../../models/Courses";


export const GET = async (request, {params}) => {
try 
  {
    await connect ();
    const course = await Courses.findById(params.CourseId);
    
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
      const {coName, coTags, coIntro, coDesc, coPrice, coDisc, coVal, coCat, coImage} = await request.json();
      await connect ();
      const course = await Courses.findById(params.CourseId);

      if (!course) {
      return new NextResponse("No course found with the given ID", {status: 404});
      }

   // Update the course
      Object.assign(course, {coName, coTags, coIntro, coDesc, coPrice, coDisc, coVal, coCat, coImage});
      await course.save();
      return NextResponse.json({ message: 'Course updated successfully', success:true }, {status:200});

   }  catch(error){
      return new NextResponse ("Erron while updating data: " + error, {status: 500});
      }
}

export const DELETE = async (request, {params}) =>{
try 
   {
      await connect ();
      const course = await Courses.findById(params.CourseId);
      if (!course) {
      return new NextResponse("No course found with the given ID", {status: 404});
      }

      await course.pull({ _id: params.CourseId });

      return new NextResponse(JSON.stringify({message: 'Course removed successfully.'}), {status: 200});
   }catch (error) {
      return new NextResponse ("Erron while deleting data: " + error, {status: 500});
      } 
}