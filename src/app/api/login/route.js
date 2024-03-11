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

        const response = NextResponse.json({result:{id:userByName._id, role:userByName.usrRole}, success:true, token:token}, {status: 200});
        // response.cookies.set({          
        //   name: 'token',
        //   value: token,
        //   maxAge: process.env.LOGIN_EXPIRES,
        //   httpOnly: true, // This prevents scripts from accessing
        //   sameSite: 'strict', // This does not allow other sites to access
        // });        
        return response;

      }catch(error){
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map(val => val.message);
          return NextResponse.json({ success: false, message: messages }, {status:400});
        }else{
          return new NextResponse ("Error while logging in...: " + error, {status: 400});
        }
      }
  }

export const PROTECT = async (req, response, next) =>{
try 
  {
    //Check if the token exists.
    const isToken = req.headers.authorization; 
    console.log(isToken);

    let token;

    if(isToken && isToken.startsWith('Bearer')){
      token = isToken.split(' ')[1];
    }   

    if(!token){
      return new NextResponse(JSON.stringify({ success: false, token:'',  message: 'You are not logged in...!' }), {status:401});
    }

    console.log(token);
    //Validate the token.
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
    console.log(decodedToken);
    //Check if user exists after the token was issued.
    const user = await Users.findById(decodedToken.id);

    if(!user){
      return new NextResponse(JSON.stringify({ success: false,   message: 'User with the given token does not exist...!' }), {status:401});
    }
    //Check if the user changed the password after the token was issued.
    //Allow user to access routes.
    req.user = user;
    next();

  }catch (error){
    console.log(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return new NextResponse(JSON.stringify({ success: false, message: messages }), {status:400});
    }else if(error.name === 'TokenExpiredError'){
      return new NextResponse(JSON.stringify({ success: false, message: 'Session expired! Please login again.' }), {status:401});
    }else if(error.name === 'JsonWebTokenError'){
      return new NextResponse(JSON.stringify({ success: false, message: 'Invalid token! Please login again.' }), {status:401});
    }else{
      return new NextResponse ("Error while logging in...:" + error, {status: 400});
    }
  }
}

export const RESTRICT = (usrRole) =>{
    return (req, res, next) =>{
      if(req.user.usrRole !== usrRole){
        return new NextResponse(JSON.stringify({ success: false, message: 'You are not authorized to perform this action!' }), {status:403});
      }
      next();
    }
}

