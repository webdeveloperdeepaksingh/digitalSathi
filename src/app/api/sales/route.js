import { NextResponse } from "next/server";
import connect from "../../../../server";
import Users from "../../../../models/Users";
import Payments from "../../../../models/Payments";

export const GET = async (request) => {
  
    try{
  
        const url = new URL(request.url);
        const userId=url.searchParams.get('userId');
        const query = url.searchParams.get('query');

        await connect ();
        let user = await Users.findOne({_id:userId});
        let posts = await  Payments.find();

        posts=posts.filter(a=> user.usrRole == 'ADMIN' || a.userId == userId);
        if (query){
          posts = posts.filter(a => a.usrName.toLowerCase().includes(query.toLowerCase()));
        }
        return new NextResponse (JSON.stringify(posts), {status: 200});
  
    }catch(error){
      return new NextResponse ("Erron while fetching data: " + error, {status: 500});
    }
  };