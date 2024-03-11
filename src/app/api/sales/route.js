import { NextResponse } from "next/server";
import connect from "../../../../server";
import Users from "../../../../models/Users";
import Payments from "../../../../models/Payments";


export const GET = async (request) => { 
try
  {
    const url = new URL(request.url);
    const userId=url.searchParams.get('userId');
    const query = url.searchParams.get('query');
    const page = url.searchParams.get('pageNbr');
    const pageSize = 20;

    await connect ();
    let user = await Users.findOne({_id:userId});
    let transectionList = await  Payments.find();
    transectionList = transectionList.filter(a=> user.usrRole == 'ADMIN' || a.userId == userId);
    
    if (query){
      transectionList = transectionList.filter(a => a.custEmail.toLowerCase().includes(query.toLowerCase()));
      return new NextResponse (JSON.stringify({transectionList}), {status: 200});
    }else if(page){
      const totalItems = transectionList.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      transectionList = transectionList.slice((page - 1) * pageSize, page * pageSize);
      return new NextResponse (JSON.stringify({transectionList, totalItems, totalPages}), {status: 200});
    }else{
      return new NextResponse (JSON.stringify(transectionList), {status: 200});
    }        
  
  }catch(error){
    return new NextResponse ("Error while fetching data: " + error, {status: 500});
  }
  };