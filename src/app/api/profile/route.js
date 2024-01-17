import Profile from "../../../../models/Profiles";
import { NextResponse } from "next/server";
import connect from "../../../../server";

// export const GET = async (request, {params}) => {
//  try 
//   {

//     await connect ();
//     const posts = await  Profile.find()
//     const proById = posts.filter((item)=> item.id == params.ProId)
//     return NextResponse.json({ result:proById, success:true}, {status: 200});

//   } catch (error){
//     return NextResponse.json({result:"No Data Found", success:false})
//   }
// }

export  const  POST = async (request, {params}) =>{ 
  try  
    {
      const {proName, proFather, proDob, proJob, proQual, shortIntro, proAbout, proCloc, proPloc} = await request.json(); 
      
      await connect ();

      const profile = new Profile({proName, proFather, proDob, proJob, proQual, shortIntro, proAbout, proCloc, proPloc});
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
