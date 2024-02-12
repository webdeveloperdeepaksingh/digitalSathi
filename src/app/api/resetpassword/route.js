import { NextResponse } from "next/server";
import Users from "../../../../models/Users";
import connect from "../../../../server";

const crypto = require('crypto-browserify');

export const PATCH = async (request) =>{

try 
{
    const {token, usrPass, confPass}=await request.json();

    await connect();
    const resetLink = crypto.createHash('sha256').update(token).digest('hex');
    const user = await Users.findOne({pwdResetToken:resetLink, pwdResetTokenExpires: {$gt: Date.now()}});

    //If the user exists with the given resetLink and the link has not expired.
    if(!user){
        return NextResponse.json({ success: false, message: 'The reset link is invalid or has expired...!' }, {status:400}); 
    }else{
        user.usrPass=usrPass;
        user.confPass=confPass;
        user.pwdResetToken=undefined;
        user.pwdResetTokenExpires=undefined;
        await user.save({runValidators: true}); 
        return NextResponse.json({ success: true, message: 'Password reset successfully' }, {status:200}); 
     }
} catch(error) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return NextResponse.json({ success: false, message: messages }, {status:400});
    }else{
        return new NextResponse ("Error while posting data: " + error, {status: 400});
    }
}
}