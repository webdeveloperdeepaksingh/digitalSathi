import { NextResponse } from "next/server";
import connect from "../../../../../server";
import Events from "../../../../../models/Events";
 

export const GET = async (request, {params}) => {
try 
   {
      await connect ();
      const event = await Events.findById(params.EventId);
      
      if (!event) {
            return new NextResponse("No event found with the given ID", {status: 404});
      }
      return NextResponse.json({result:event}, {status: 200});    

   }catch(error){
      return new NextResponse ("Erron while retrieving data: " + error, {status: 500});
    }
}

export const PUT = async (request, {params}) =>{

      try 
      {
            const {evtName, shortIntro, evtDesc, evtCat, origPrice, discPrice, evtPer, evtLoc, evtMod, evtPhone, evtTime, evtDate, evtImage } = await request.json();
            const eventId = params.EventId;
            const filter = {_id:eventId}
            
            await connect ();
            const existingEvent = await Events.findOne({evtName});
      
            if(existingEvent){
                  return NextResponse.json({ success: false, message: 'Event title already exists !' }, {status:400});
            }else
            {
                  const posts = await Events.findOneAndUpdate(filter, {evtName, shortIntro, evtDesc, evtCat, origPrice, discPrice, evtPer, evtLoc, evtMod, evtPhone, evtTime, evtDate, evtImage });
                  return NextResponse.json({result:posts, success:true}, {status:200});
            }
      } catch (error) {
            return new NextResponse ("Erron while saving data" + error, {status: 500});
          }
}

export const DELETE = async (request, {params}) =>{

      try 
      {
            const eventId = params.EventId;
            const record = {_id:eventId}
            
            await connect ();
            let posts = await Events.deleteOne(record);
            return NextResponse.json({posts, success:true}, {status:200});
      
      } catch (error) {
            return new NextResponse ("Erron while deleting data" + error, {status: 500});
          }
}

