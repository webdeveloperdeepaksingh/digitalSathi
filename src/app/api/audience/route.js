import { NextResponse } from "next/server";
import Participents from "../../../../models/Participents";
import Users from "../../../../models/Users";
import connect from "../../../../server";

export const GET = async (request) => {
  
  try{

      const url = new URL(request.url);
      const userId = url.searchParams.get('userId');
      const query = url.searchParams.get('query');

      await connect ();
      let user = await Users.findOne({_id:userId});
      let posts = await  Participents.find();

      posts = posts.filter(a=> user.usrRole == 'ADMIN' || a.userId == userId);
      if (query){
        posts = posts.filter(a => a.partName.toLowerCase().includes(query.toLowerCase()));
      }
      return new NextResponse (JSON.stringify(posts), {status: 200});

  }catch(error){
    return new NextResponse ("Erron while fetching data: " + error, {status: 500});
  }
};

export  const  POST = async (request) =>{ 
  try  
    {
      const {partName, prodName, partEmail, partPhone, hostContact, userId} = await request.json(); 
      await connect ();

      const existingEmail = await Participents.findOne({ partEmail});
      const existingPhone = await Participents.findOne({ partPhone});
      
      if (existingEmail) {
        return NextResponse.json({ success: false,  message: 'This email is already registered !' }, {status:400});
      }
      
      if(existingPhone){
        return NextResponse.json({ success: false, message: 'This phone is already registered !' }, {status:400});
      }else{
        const aud = new Participents({partName, prodName, partEmail, partPhone, hostContact, userId});
        const result = await aud.save();
        return NextResponse.json({result:result, success:true}, {status: 200});
      }
    }catch(error){
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return NextResponse.json({ success: false, message: messages }, {status:400});
      }else{
        return new NextResponse ("Erron while saving data: " + error, {status: 400});
      }
    }
}
