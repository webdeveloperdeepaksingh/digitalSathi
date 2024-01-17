import Users from "../../../../models/Users"; 
import { NextResponse } from "next/server";
import connect from "../../../../server";
import Profiles from "../../../../models/Profiles";

const jwt = require('jsonwebtoken');

export const GET = async (request) => {
  try
    {
      await connect ();
      const posts = await  Users.find()
      return new NextResponse (JSON.stringify(posts), {status: 200});

    }catch(error){
      return new NextResponse ("Erron while fetching data" + error, {status: 500});
    }
}

export  const  POST = async (request, response, next) =>{ 
  try  
    {
      const {usrName, usrPass, usrConfPass, usrEmail, usrPhone, usrRole} = await request.json(); 
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
          const user = new Users({usrName, usrPass, usrConfPass, usrEmail, usrPhone, usrRole});
          const profile = new Profiles({userId: user._id, proName: user.usrName});
          const token = jwt.sign({id: user._id}, process.env.SECRET_STR, {expiresIn: process.env.LOGIN_EXPIRES})

          const proData = await profile.save(); //creating profile simultaniously by posting userId & proName.

          if(proData){
            const result = await user.save();
            return NextResponse.json({result:result, proData:proData, success:true, token}, {status: 200});
          }else{
            return NextResponse.json({success:false, message: 'Profile creation failed...!'}, {status: 400});
          }                            
      }
    }catch(error){
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return NextResponse.json({ success: false, message: messages }, {status:400});
      }else{
        return new NextResponse ("Erron while saving data" + error, {status: 400});
      }
    }
}
