import { NextResponse } from "next/server";
import connect from "../../../../../server";
import { Products } from "../../../../../models/Products";
 
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
      return new NextResponse ("Erron while retrieving data: " + error, {status: 500});
    }
}

export const PUT = async (request, {params}) =>{

      try 
      {
            const { prodName, prodIntro, prodType, prodTax, prodDisct, prodTags, prodAuth, prodDesc, prodCat, prodPrice, prodDisc, prodTime, prodDate, prodImage } = await request.json();
            const eventId = params.EventId;
            const filter = {_id:eventId}
            
            await connect ();
            const posts = await Products.findOneAndUpdate(filter, {prodName, prodIntro, prodType, prodTax, prodDisct, prodTags, prodAuth, prodDesc, prodCat, prodPrice, prodDisc, prodTime, prodDate, prodImage });
            return NextResponse.json({result:posts, success:true}, {status:200});
      
      } catch (error) {
            return new NextResponse ("Erron while saving data: " + error, {status: 500});
          }
}

export const DELETE = async ({params}) =>{

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

