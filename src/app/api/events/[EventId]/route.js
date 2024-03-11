import { NextResponse } from "next/server";
import connect from "../../../../../server";
import { Products } from "../../../../../models/Products";
import Users from "../../../../../models/Users";
 
export const GET = async (request, {params}) => {
try 
   {
      await connect ();
      const event = await Products.findById(params.EventId);
      
      if (!event) {
            return new NextResponse("No event found with the given ID", {status: 404});
      }
      return NextResponse.json({result:event}, {status: 200});    

   }catch(error){
      return new NextResponse ("Error while retrieving data: " + error, {status: 500});
    }
}

export const PUT = async (request, {params}) =>{
try 
      {
      const {prodName, prodIntro, prodMeetLink, prodTags, prodDesc, prodPrice,  prodTax, prodDisct, prodDisc, prodAuth, prodCont, prodCat, prodTime, prodDate, prodImage, studentEmailIds, allowAccess } = await request.json();
      const event = await Products.findById(params.EventId);

      if (!event) {
            return new NextResponse("No event found with the given ID", {status: 404});
      }

      if(allowAccess === "Allowed")
      {
            for(var stu in studentEmailIds){
                  let uem = studentEmailIds[stu];
                  let user = await Users.findOne({usrEmail:uem});
                  if(user){
                        event.allowAccess.push({usrId:user._id, usrEmailId:uem});      
                  }else{
                        return NextResponse.json({ message: `No user exists with this email: ${uem}`, success: false  }, {status:404});
                  }
            }     
            Object.assign(event);
      }
      else if(allowAccess === "Disallowed"){
            for(var stu in studentEmailIds){
                  let uem=studentEmailIds[stu];
                  let user=await Users.findOne({usrEmail:uem});
                  if(user){
                        event.allowAccess.pop(user._id);      
                  }
            }   
            Object.assign(event);
      }
      else if(allowAccess !== "noaction") {
            // Update the event
            Object.assign(event, {prodName, prodTags, prodMeetLink, prodAuth, prodIntro, prodTax, prodDisct,  prodDesc, prodCat, prodTime, prodCont, prodDate, prodPrice, prodDisc, prodImage });
      }
      await event.save();
      return NextResponse.json({result:event, message: 'Event updated successfully', success:true }, {status:200});

      } catch (error) {
      return new NextResponse ("Error while saving data: " + error, {status: 500});
      }
}

export const DELETE = async (request, {params}) =>{
try 
{
      const eventId = params.EventId;
      const record = {_id:eventId}
      
      await connect ();
      let posts = await Products.deleteOne(record);
      return NextResponse.json({posts, success:true}, {status:200});

} catch (error) {
      return new NextResponse ("Erron while deleting data: " + error, {status: 500});
}
}

