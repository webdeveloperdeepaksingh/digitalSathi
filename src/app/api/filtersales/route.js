import { NextResponse } from "next/server";
import Payments from "../../../../models/Payments";
import connect from "../../../../server";



export default async function handler(req, res) {
try 
{
    const { startDate, endDate } = req.query; 
    await connect ();
    
    const filteredData = await Payments.find({
    createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
    },
    }).toArray();

    return NextResponse.json({result:filteredData, success:true}, {status: 200});

} catch (error) {
      return new NextResponse ("Error fetching filtered sales data: " + error, {status: 500});
    }
}
  