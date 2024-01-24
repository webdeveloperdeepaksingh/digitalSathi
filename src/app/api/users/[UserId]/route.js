import Users from "../../../../../models/Users";
import { NextResponse } from "next/server";
import connect from "../../../../../server";

const bcrypt = require('bcryptjs');

export const GET = async (request, {params}) => {
try 
      {
      await connect ();
      const user = await Users.findById(params.UserId);
      
      if (!user) {
            return new NextResponse("No user found with the given ID", {status: 404});
      }
      return NextResponse.json({result:user}, {status: 200});    

      }catch(error){
      return new NextResponse ("Erron while retrieving data: " + error, {status: 500});
      }
}

export const PUT = async (request, {params}) =>{
      try 
      {
            const {usrName, usrPass, usrEmail, usrPhone, usrRole, oldPass, confPass, isPasswordChangeRequest} = await request.json();
            const userId = params.UserId;
            const filter = {_id:userId};
            await connect (); 

            let user = await Users.findById(filter); 
            
            if(isPasswordChangeRequest === true){
                  if(!(await bcrypt.compare(oldPass, user.usrPass))){
                        return NextResponse.json({ success: false,  message: 'Invalid old password...!' }, {status:400});
                  }else{
                        user.usrPass = usrPass;
                        user.confPass = confPass;
                        const passSaved = await user.save({runValidators: true});
                        return NextResponse.json({result:passSaved, success:true}, {status:200});
                  }          
            }else{

                  const existingEmail = await Users.findOne({usrEmail});
                  const existingPhone = await Users.findOne({usrPhone});

                  if (!(usrEmail === user.usrEmail)) {    //check if the supplied email matches with user's existing email.    
                        if(existingEmail){ //check if the supplied email matches with any other user's existing email.
                              return NextResponse.json({ success: false,  message: 'This email is already registered !' }, {status:400});
                        }         
                  }

                  if (!(usrPhone === user.usrPhone)) {        
                        if(existingPhone){
                              return NextResponse.json({ success: false,  message: 'This phone is already registered !' }, {status:400});
                        }         
                  } 
                  const posts = await Users.findByIdAndUpdate(filter, {usrName, usrEmail, usrPhone, usrRole});           
                  return NextResponse.json({result:posts, success:true}, {status:200});
            }                        
      }
      catch(error){
            if (error.name === 'ValidationError') {
                  const messages = Object.values(error.errors).map(val => val.message);
                  return NextResponse.json({ success: false, message: messages }, {status:400});
            }else{
                  return new NextResponse ("Error while saving data: " + error, {status: 400});
            }
      }
}

export const DELETE = async (request, {params}) =>{
      try 
      {
            const userId = params.UserId;
            const record = {_id:userId}
            
            await connect ();
            let posts = await Users.deleteOne(record);
            return NextResponse.json({posts, success:true}, {status:200});
      
      } catch (error) {
            return new NextResponse ("Erron while deleting data" + error, {status: 500});
          }
}