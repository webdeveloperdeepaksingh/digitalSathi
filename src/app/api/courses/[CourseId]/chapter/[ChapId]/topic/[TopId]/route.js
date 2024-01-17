import { NextResponse } from "next/server";
import { Courses } from "../../../../../../../../../models/Courses";
import connect from "../../../../../../../../../server";

export const GET = async (request, {params}) => {

try 
  {
    await connect ();

    const course = await Courses.findById(params.CourseId);
    if (!course) {
        return new NextResponse("No course found with the given ID", {status: 404});
    }

    const chapter = course.chapters.id(params.ChapId);
    if (!chapter) {
        return new NextResponse("No chapter found with the given ID", {status: 404});
    }

    const topic = chapter.topics.id(params.TopId);
    if (!topic) {
        return new NextResponse("No topic found with the given ID", {status: 404});
    }

    return NextResponse.json({result:topic}, {status: 200});  

  }catch(error){
        return new NextResponse ("Erron while retrieving data: " + error, {status: 500});
      }
}

export const PUT = async (request, {params}) =>{

 try 
    {
      const {topName,videoUrl, pdfFile} = await request.json();
      await connect ();
      const course = await Courses.findById(params.CourseId);

      if (!course) {
          return new NextResponse("No course found with the given ID", {status: 404});
      }

      const chapter = course.chapters.id(params.ChapId);
      if (!chapter) {
            return new NextResponse("No chapter found with the given ID", {status: 404});
      }

      const topic = chapter.topics.id(params.TopId);
      if (!topic) {
            return new NextResponse("No topic found with the given ID", {status: 404});
      }

    // Update the topic
      Object.assign(topic, {topName,videoUrl, pdfFile});
      await course.save();
      return NextResponse.json({ message: 'Topic updated successfully', success:true }, {status:200});

    }catch(error){
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

      const chapter = course.chapters.id(params.ChapId);
      if (!chapter) {
      return new NextResponse("No chapter found with the given ID", {status: 404});
      }

      chapter.topics.pull({ _id: params.TopId });
      await course.save();

      return new NextResponse(JSON.stringify({message: 'Topic removed successfully.'}), {status: 200});
  }catch (error) {
      return new NextResponse ("Erron while deleting data: " + error, {status: 500});
      } 
}