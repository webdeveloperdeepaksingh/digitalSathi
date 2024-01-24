import { NextResponse } from "next/server";
import connect from "../../../../server";
import Users from "../../../../models/Users";
import Sales from "../../../../models/Sales";

export const GET = async (request, response, next) => {
  
    try{
  
        const url = new URL(request.url);
        const userId=url.searchParams.get('userId');
        await connect ();
        let user=await Users.findOne({_id:userId});
        let posts = await  Sales.find();
        posts=posts.filter(a=> user.usrRole == 'ADMIN' || a.userId == userId);
        return new NextResponse (JSON.stringify(posts), {status: 200});
  
    }catch(error){
      return new NextResponse ("Erron while fetching data: " + error, {status: 500});
    }
  };