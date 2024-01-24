import { NextResponse } from "next/server";
import connect from "../../../../../server";
import Profiles from "../../../../../models/Profiles";

export const GET = async (request, {params}) => {
  try 
    {
      await connect ();
      const profile = await Profiles.findById(params.ProId);
      
      if (!profile) {
          return new NextResponse("No profile found with the given ID", {status: 404});
      }
      return NextResponse.json({result:profile}, {status: 200});    
  
    }catch(error){
          return new NextResponse ("Erron while retrieving data: " + error, {status: 500});
        }
  }

export  const  PUT = async (request, {params}) =>{ 
  try  
    {
      const {proName, proFather, proDob, proJob, proQual, shortIntro, proAbout, proImage, proCloc, proPloc} = await request.json(); 
      const profileId = params.ProId;
      const filter = {_id:profileId}
      await connect ();

      const profile = await Profiles.findOneAndUpdate(filter, {proName, proFather, proDob, proJob, proQual, shortIntro, proAbout, proImage, proCloc, proPloc});
      return NextResponse.json({result:profile, success:true}, {status: 200});

    }catch(error){
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return NextResponse.json({ success: false, message: messages }, {status:400});
      }else{
        return new NextResponse ("Erron while saving data" + error, {status: 400});
      }
    }
}
