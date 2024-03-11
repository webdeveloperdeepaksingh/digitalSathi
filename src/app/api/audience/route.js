import { NextResponse } from "next/server";
import Users from "../../../../models/Users";
import connect from "../../../../server";
import Participents from "../../../../models/Participents";

export const GET = async (request) => {
  try
  {

      const url = new URL(request.url);
      const userId = url.searchParams.get('userId');
      const query = url.searchParams.get('query');
      const page = url.searchParams.get('pageNbr');
      const pageSize = 20;

      await connect ();
      let user = await Users.findOne({_id:userId});
      let posts = await  Participents.find();

      posts = posts.filter(a=> user.usrRole == 'ADMIN' || a.userId == userId);
      if (query){
        posts = posts.filter(a => a.custName.toLowerCase().includes(query.toLowerCase()));
        return new NextResponse (JSON.stringify({posts:posts}), {status: 200});
      }else{
        const totalItems = posts.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        posts = posts.slice((page - 1) * pageSize, page * pageSize);
        return new NextResponse (JSON.stringify({posts, totalItems, totalPages}), {status: 200});
      }

  }catch(error){
    return new NextResponse ("Error while fetching data: " + error, {status: 500});
  }
};

