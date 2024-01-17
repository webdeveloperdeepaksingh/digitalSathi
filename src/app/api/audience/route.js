import { NextResponse } from "next/server";
import Audience from "../../../../models/Audience";
import connect from "../../../../server";

export const GET = async (request) => {
  try
    {
      await connect ();
      const audList = await  Audience.find()
      return new NextResponse (JSON.stringify(audList), {status: 200});

    }catch(error){
      return new NextResponse ("Erron while fetching data: " + error, {status: 500});
    }
}

export  const  POST = async (request) =>{ 
  try  
    {
      const {audName, evtName, audEmail, audPhone} = await request.json(); 
      await connect ();

      const existingEmail = await Audience.findOne({ audEmail});
      const existingPhone = await Audience.findOne({ audPhone});
      
      if (existingEmail) {
        return NextResponse.json({ success: false,  message: 'This email is already registered !' }, {status:400});
      }
      
      if(existingPhone){
        return NextResponse.json({ success: false, message: 'This phone is already registered !' }, {status:400});
      }else{
        const aud = new Audience({audName, evtName, audEmail, audPhone});
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
