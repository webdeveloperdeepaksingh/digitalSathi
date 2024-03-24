import { NextResponse } from "next/server";
import connect from "../../../../../server";
import Settings from "../../../../../models/Settings";

export const GET = async (request, {params}) => {
 try 
  {

    await connect ();
    const posts = await  Settings.findById(params.SettId)

    if (!posts) {
      return new NextResponse("No post found with the given ID", {status: 404});
    }
    return NextResponse.json({result:posts}, {status: 200}); 
  } catch (error){
    return NextResponse.json({result:"No Data Found", success:false})
  }
}

export  const  PUT = async (request, {params}) =>{ 
  try  
    {
      const { brandTitle, brandTags, brandTax, brandDisc, brandCurr, brandIntro, brandLogo, brandIcon, brandBanner } = await request.json(); 
      const settingId = params.SettId;
      const filter = {_id:settingId}
      await connect ();

      const settings = await Settings.findOneAndUpdate(filter, { brandTitle, brandTags, brandTax, brandDisc, brandCurr, brandIntro, brandLogo, brandIcon, brandBanner });
      return NextResponse.json({result:settings, success:true}, {status: 200});

    }catch(error){
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return NextResponse.json({ success: false, message: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving data: " + error, {status: 400});
      }
    }
}
