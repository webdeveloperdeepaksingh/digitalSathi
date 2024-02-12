import Participents from "../../../../../models/Participents";
import { NextResponse } from "next/server";
import connect from "../../../../../server";

export const DELETE = async (request, {params}) =>{
try 
{
        const audId = params.AudId;
        const record = {_id:audId}
        
        await connect ();
        let posts = await Participents.deleteOne(record);
        return NextResponse.json({posts, success:true}, {status:200});

} catch (error) {
        return new NextResponse ("Erron while deleting data" + error, {status: 500});
    }
}