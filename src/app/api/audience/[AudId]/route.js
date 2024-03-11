import Participents from "../../../../../models/Participents";
import { NextResponse } from "next/server";
import connect from "../../../../../server";


export const GET = async (request, {params}) => {
try 
{
        await connect ();
        const aud = await Participents.findById(params.AudId);
        if (!aud) {
        return new NextResponse("No audience found with the given ID", {status: 404});
        }
        return NextResponse.json({result:aud}, {status: 200});    

}catch(error){
        return new NextResponse ("Erron while retrieving data: " + error, {status: 500});
}
}

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