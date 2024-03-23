import { NextResponse } from "next/server";
import connect from "../../../../server";
import Users from "../../../../models/Users";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const util = require('util');

export  const  POST = async (request, response, next) =>{ 
try  
  {
    const {usrName, usrPass} = await request.json(); 
    await connect ();
    //Check if the user exists with the given usrName & usrPass. 
    let userByName = await Users.findOne({ $or: [{ usrName }, { usrEmail: usrName }] });
        
    if (!userByName || !(await bcrypt.compare(usrPass, userByName.usrPass))) {
      return NextResponse.json({ success: false, token:'',  message: 'Invalid user or password...!' }, {status:400});
    }
    
    const token = jwt.sign({id: userByName._id}, process.env.SECRET_STR, {expiresIn: process.env.LOGIN_EXPIRES});
    userByName.usrPass = null; // stopping password to get sent in response.
    return NextResponse.json({result:{id:userByName._id, role:userByName.usrRole, userToken:token, success:true}}, {status: 200});

  }catch(error){
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ success: false, message: messages }, {status:400});
    }else{
      return new NextResponse ("Error while logging in...: " + error, {status: 400});
    }
  }
}



