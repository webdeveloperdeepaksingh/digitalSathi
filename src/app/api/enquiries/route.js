import Enquiries from "../../../../models/Enquiries";
import { NextResponse } from "next/server";
import connect from "../../../../server";

export const GET = async (request) => {
  try{

      await connect ();
      const posts = await  Enquiries.find()
      return new NextResponse (JSON.stringify(posts), {status: 200});

  }catch(error){
    return new NextResponse ("Erron while fetching data" + error, {status: 500});
  }
}

export  const  POST = async (request) =>{
  
    try 
    
    {
      const payload = await request.json(); 
      await connect ();
      let posts = new Enquiries(payload);

      const result = await posts.save();
      return NextResponse.json({result, success:true}, {status: 200});

    }catch(error) {
      return new NextResponse ("Erron while saving data: " + error, {status: 500});
    }
}
