import Enquiries from "../../../../../models/Enquiries";
import { NextResponse } from "next/server";
import connect from "../../../../../server";


export const GET = async (request, {params}) => {

      await connect ();
      const posts = await  Enquiries.find()
      const eqrById = posts.filter((item)=> item.id == params.EqrId)
      return NextResponse.json(eqrById.length ==0?{result:"No Data Found", success:false} : { result:eqrById, success:true}, {status: 200});
}

export const PUT = async (request, {params}) =>{

      try 
      {
            const payload = await request.json();
            const eqrId = params.EqrId;
            const filter = {_id:eqrId}
            
            await connect ();
            let posts = await Enquiries.findOneAndUpdate(filter, payload);
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

