import Profiles from "../../../../models/Profiles";
import { NextResponse } from "next/server";
import Users from "../../../../models/Users";
import connect from "../../../../server";

export const GET = async (request) => {
  try{

      await connect ();
      const proList = await  Profiles.find()
      return new NextResponse (JSON.stringify(proList), {status: 200});

  }catch(error){
    return new NextResponse ("Erron while fetching data: " + error, {status: 500});
  }
}

export  const  POST = async (request, {params}) =>{ 
  try  
    {
      const {proName, proFather, proDob, proJob, proQual, shortIntro, proAbout, proCloc, proPloc, proAdd, proId} = await request.json(); 
      
      await connect ();

      const profile = new Profiles({proName, proFather, proDob, proJob, proQual, shortIntro, proAbout, proCloc, proPloc, proAdd, proId});
      const profileData = await profile.save();
      return NextResponse.json({result:profileData, success:true}, {status: 200});

    }catch(error){
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return NextResponse.json({ success: false, message: messages }, {status:400});
      }else{
        return new NextResponse ("Erron while saving data: " + error, {status: 400});
      }
    }
}
