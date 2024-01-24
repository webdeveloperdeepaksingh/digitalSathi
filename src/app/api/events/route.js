import Events from "../../../../models/Events";
import { NextResponse } from "next/server";
import connect from "../../../../server";
import Users from "../../../../models/Users";


export const GET = async (request, response, next) => {
  
  try{

      const url = new URL(request.url);
      const userId=url.searchParams.get('userId');
      await connect ();
      let user=await Users.findOne({_id:userId});
      let posts = await  Events.find();
      posts = posts.filter(a=> user.usrRole == 'ADMIN' || a.userId == userId);
      return new NextResponse (JSON.stringify(posts), {status: 200});

  }catch(error){
    return new NextResponse ("Erron while fetching data: " + error, {status: 500});
  }
};

export  const  POST = async (request) =>{ 
  try  
    {
      const {evtName, shortIntro, evtDesc, evtCat, origPrice, discPrice, evtPer, evtLoc, evtMod, evtPhone, evtTime, evtDate, evtImage, userId } = await request.json(); 
      await connect ();

      const existingEvent = await Events.findOne({evtName});
      
      if(existingEvent){
        return NextResponse.json({ success: false, message: 'Event title already exists !' }, {status:400});
      }else
      {
        const event = new Events({evtName, shortIntro, evtDesc, evtCat, origPrice, discPrice, evtPer, evtLoc, evtMod, evtPhone, evtTime, evtDate, evtImage, userId});
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
