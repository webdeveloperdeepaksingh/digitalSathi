import {Products} from "../../../../../../../models/Products";
import connect from "../../../../../../../server";
import { NextResponse } from "next/server";



export const GET = async (request, {params}) => {

try 
  {
    await connect ();
    const course = await Products.findById(params.CourseId);

    if (!course) {
        return new NextResponse("No course found with the given ID", {status: 404});
    }

    const chapter = course.chapters.id(params.ChapId);
    if (!chapter) {
        return new NextResponse("No chapter found with the given ID", {status: 404});
    }

    return NextResponse.json({result:chapter}, {status: 200});  

  }catch(error){
        return new NextResponse ("Erron while retrieving data: " + error, {status: 500});
      }
}

export const PUT = async (request, {params}) =>{

try 
    {
      const {chapName} = await request.json();
      await connect ();
      const course = await Products.findById(params.CourseId);

      if (!course) {
          return new NextResponse("No course found with the given ID", {status: 404});
      }

      const chapter = course.chapters.id(params.ChapId);
      if (!chapter) {
            return new NextResponse("No chapter found with the given ID", {status: 404});
      }

    // Update the chapter
      Object.assign(chapter, {chapName});
      await course.save();
      return NextResponse.json({ message: 'Chapter updated successfully', success:true }, {status:200});

    } catch(error){
      return new NextResponse ("Erron while updating data: " + error, {status: 500});
     }
}

export const DELETE = async (request, {params}) =>{
try 
  {
    await connect ();
    const course = await Products.findById(params.CourseId);

    if (!course) {
      return new NextResponse("No course found with the given ID", {status: 404});
    }

    course.chapters.pull({ _id: params.ChapId });
    await course.save();
    return new NextResponse(JSON.stringify({message: 'Chapter removed successfully.'}), {status: 200});

  }catch (error) {
      return new NextResponse ("Erron while deleting data: " + error, {status: 500});
    }       
}