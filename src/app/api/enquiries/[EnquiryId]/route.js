import Enquiries from "../../../../../models/Enquiries";
import { NextResponse } from "next/server";
import connect from "../../../../../server";


export const GET = async (request, {params}) => {

try 
{
      await connect ();
      const enquiryById = await  Enquiries.findById(params.EnquiryId);
      return NextResponse.json({result:enquiryById, success:true}, {status:200});
      
} catch (error) {
      return new NextResponse ("Erron while fetching data: " + error, {status: 500});
}
}

export const PUT = async (request, {params}) =>{

      try 
      {
            const {eqrPerson, eqrEmail, eqrSub, eqrPhone, eqrMsg} = await request.json();
            const eqrId = params.EqrId;
            const filter = {_id:eqrId}
            
            await connect ();
            let posts = await Enquiries.findOneAndUpdate(filter, {eqrPerson, eqrEmail, eqrSub, eqrPhone, eqrMsg});
            return NextResponse.json({result:posts, success:true}, {status:200});
      
      } catch (error) {
            return new NextResponse ("Erron while saving data" + error, {status: 500});
          }
}

export const DELETE = async (request, {params}) =>{

      try 
      {
            const eqrId = params.EqrId;
            const record = {_id:eqrId}
            
            await connect ();
            let posts = await Enquiries.deleteOne(record);
            return NextResponse.json({posts, success:true}, {status:200});
      
      } catch (error) {
            return new NextResponse ("Erron while deleting data" + error, {status: 500});
          }
}

