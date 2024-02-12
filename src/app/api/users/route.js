import Users from "../../../../models/Users"; 
import { NextResponse } from "next/server";
import connect from "../../../../server";
import Profiles from "../../../../models/Profiles";

   
export const GET = async (request) => {
  try
    {
      const url = new URL(request.url);
      const userId = url.searchParams.get('userId');
      const query = url.searchParams.get('query');

      await connect ();
      let user = await Users.findOne({_id:userId});
      let posts = await  Users.find()

      posts = posts.filter(a=> user.usrRole == 'ADMIN' || a.userId == userId);
      if (query){
        posts = posts.filter(a => a.usrName.toLowerCase().includes(query.toLowerCase()));
      }
      return new NextResponse (JSON.stringify(posts), {status: 200});

    }catch(error){
      return new NextResponse ("Erron while fetching data" + error, {status: 500});
    }
}

export  const  POST = async (request, response, next) =>{ 
  try  
    {
      const {usrName, usrPass, confPass, usrEmail, usrPhone, usrRole} = await request.json(); 
      await connect ();

      const existingEmail = await Users.findOne({ usrEmail});
      const existingPhone = await Users.findOne({ usrPhone});
      
      if (existingEmail) {
        return NextResponse.json({ success: false,  message: 'This email is already registered !' }, {status:400});
      }
      
      if(existingPhone){
        return NextResponse.json({ success: false, message: 'This phone is already registered !' }, {status:400});
      }else
      {
          const user = new Users({usrName, usrPass, confPass, usrEmail, usrPhone, usrRole});
          const profile = new Profiles({userId: user._id, proName: usrName});
          const proData = await profile.save(); //creating profile simultaniously by posting userId & proName.

          if(proData){
            const result = await user.save();
            return NextResponse.json({result:result, proData:proData, success:true}, {status: 200});
          }else{
            return NextResponse.json({success:false, message: 'Profile creation failed...!'}, {status: 400});
          }                                
      }
    }catch(error){
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return NextResponse.json({ success: false, message: messages }, {status:400});
      }else{
        return new NextResponse ("Error while saving data: " + error, {status: 400});
      }
    }
}
