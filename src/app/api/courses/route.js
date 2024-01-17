import { NextResponse } from "next/server";
import connect from "../../../../server";
import { Courses } from "../../../../models/Courses";
import Users from "../../../../models/Users";
import { PROTECT } from "../login/route";

export const GET =  async (request, response, next) => {
  
  try{
     
      await connect ();
      // let user=await Users.findOne({_id:'65a62bdcba316ba0dc059e30'});
      let posts = await  Courses.find();
      // posts=posts.filter(a=> user.usrRole=='ADMIN' || a.userId=='65a62bdcba316ba0dc059e30');
      return new NextResponse (JSON.stringify(posts), {status: 200});

  }catch(error){
    return new NextResponse ("Erron while fetching data" + error, {status: 500});
  }
};

export  const  POST = async (request) =>{
  
    try    
    {
      const {coName, coTags, coIntro, coDesc, coCat, coVal, coPrice, coDisc, coImage } = await request.json(); 
      await connect ();

      const posts = new Courses({coName, coTags, coIntro, coDesc, coCat, coVal, coPrice, coDisc, coImage });
      const result = await posts.save();
      return NextResponse.json({result:result, success:true}, {status: 200});

    } catch (error) {
      return new NextResponse ("Erron while saving data" + error, {status: 500});
    }
}