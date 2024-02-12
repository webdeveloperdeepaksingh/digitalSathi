import { NextResponse } from "next/server";
import Settings from "../../../../models/Settings"; 
import connect from "../../../../server";


export const GET = async (request, {params}) => {
 try 
  {

    await connect ();
    const posts = await  Settings.find()
    return NextResponse.json({ result:posts, success:true}, {status: 200});

  } catch (error){
    return NextResponse.json({result:"No Data Found", success:false})
  }
}

export  const  POST = async (request) =>{ 
  try  
    {
      const { brandTitle, brandTags, brandCurr, brandIntro } = await request.json(); 
      await connect ();

      const settings = new Settings({ brandTitle, brandTags, brandCurr, brandIntro });
      const settingData = await settings.save();
      return NextResponse.json({result:settingData, success:true}, {status: 200});

    }catch(error){
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return NextResponse.json({ success: false, message: messages }, {status:400});
      }else{
        return new NextResponse ("Erron while saving data" + error, {status: 400});
      }
    }
}
