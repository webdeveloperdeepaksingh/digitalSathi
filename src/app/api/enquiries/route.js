import Enquiries from "../../../../models/Enquiries";
import { NextResponse } from "next/server";
import connect from "../../../../server";
import Users from "../../../../models/Users";

export const GET = async (request) => {
  try{

      const url = new URL(request.url);
      const userId=url.searchParams.get('userId');
      const query = url.searchParams.get('query');

      await connect ();
      let user=await Users.findOne({_id:userId});
      let posts = await  Enquiries.find()

      posts = posts.filter(a=> user.usrRole == 'ADMIN' || a.userId == userId);
      if (query){
        posts = posts.filter(a => a.eqrPerson.toLowerCase().includes(query.toLowerCase()));
      }
      return new NextResponse (JSON.stringify(posts), {status: 200});

  }catch(error){
    return new NextResponse ("Erron while fetching data" + error, {status: 500});
  }
}

export  const  POST = async (request) =>{
  
try 
    
  {
    const {eqrPerson, eqrEmail, eqrSub, eqrPhone, eqrMsg} = await request.json(); 
    await connect ();
    let posts = new Enquiries({eqrPerson, eqrEmail, eqrSub, eqrPhone, eqrMsg});

    const result = await posts.save();
    return NextResponse.json({result, success:true}, {status: 200});

  }catch(error) {
      return new NextResponse ("Erron while saving data: " + error, {status: 500});
    }
}
