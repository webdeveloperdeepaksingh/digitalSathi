import Events from "../../../../models/Events";
import { NextResponse } from "next/server";
import connect from "../../../../server";


export const GET = async (request) => {
  try{

      await connect ();
      const posts = await  Events.find()
      return new NextResponse (JSON.stringify(posts), {status: 200});

  }catch(error){
    return new NextResponse ("Erron while fetching data" + error, {status: 500});
  }
}

export  const  POST = async (request) =>{ 
  try  
    {
      const {evtName, shortIntro, evtDesc, evtCat, origPrice, discPrice, evtPer, evtLoc, evtMod, evtPhone, evtTime, evtDate, evtImage } = await request.json(); 
      await connect ();

      const existingEvent = await Events.findOne({evtName});
      
      if(existingEvent){
        return NextResponse.json({ success: false, message: 'Event title already exists !' }, {status:400});
      }else
      {
        const event = new Events({evtName, shortIntro, evtDesc, evtCat, origPrice, discPrice, evtPer, evtLoc, evtMod, evtPhone, evtTime, evtDate, evtImage});
        const result = await event.save();
        return NextResponse.json({result, success:true}, {status: 200});
      }
    }catch(error){
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return NextResponse.json({ success: false, message: messages }, {status:400});
      }else{
        return new NextResponse ("Erron while saving data" + error, {status: 400});
      }
    }
}
