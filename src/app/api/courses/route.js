import { NextResponse } from "next/server";
import connect from "../../../../server";
import { Courses } from "../../../../models/Courses";
import Users from "../../../../models/Users";
import { PROTECT } from "../login/route";


export const GET = async (request, response, next) => {
  
  try{

      const url = new URL(request.url);
      const userId=url.searchParams.get('userId');
      await connect ();
      let user=await Users.findOne({_id:userId});
      let posts = await  Courses.find();
      posts=posts.filter(a=> user.usrRole == 'ADMIN' || a.userId == userId);
      return new NextResponse (JSON.stringify(posts), {status: 200});

  }catch(error){
    return new NextResponse ("Erron while fetching data: " + error, {status: 500});
  }
};

export  const  POST = async (request) =>{
  
    try    
    {
      const {coName, coTags, coIntro, coDesc, coCat, coVal, coPrice, coDisc, coImage, userId } = await request.json(); 
      await connect ();

      const posts = new Courses({coName, coTags, coIntro, coDesc, coCat, coVal, coPrice, coDisc, coImage, userId });
      const result = await posts.save();
      return NextResponse.json({result:result, success:true}, {status: 200});

    } catch (error) {
      return new NextResponse ("Erron while saving data" + error, {status: 500});
    }
}