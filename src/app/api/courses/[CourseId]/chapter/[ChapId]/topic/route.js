import { Courses } from "../../../../../../../../models/Courses";
import connect from "../../../../../../../../server";
import { NextResponse } from "next/server";

export const GET = async (request,{params}) => {
  
  try{

      await connect ();
      let topList = await  Topics.find()

      if(topList != null){
        topList = topList.filter((item)=> item.chapId == params.ChapId);
      }

      return new NextResponse (JSON.stringify(topList), {status: 200});

  }catch(error){
    return new NextResponse ("Erron while fetching data" + error, {status: 500});
  }
}

export  const  POST = async (request, {params}) =>{
  
  try    
  {
    const payload = await request.json(); 
    await connect ();

    const course = await Courses.findById(params.CourseId)

    if (!course) {
      return new NextResponse("No course found with the given ID", {status: 404});
    }

    const chapter = course.chapters.id(params.ChapId);

    if (!chapter) {
      return new NextResponse("No chapters found with the given ID", {status: 404});
    }

    chapter.topics.push(payload)
    const result = await course.save();
    return NextResponse.json({result:result, success:true}, {status: 200});

  }catch(error){
      return new NextResponse ("Erron posting data: " + error, {status: 500});
    }
}