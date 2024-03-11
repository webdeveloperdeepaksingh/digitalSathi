import { NextResponse } from "next/server";
import Users from "../../../../models/Users";
import connect from "../../../../server";
import sendEmail from "./../../../../utils/email"; 

const crypto = require('crypto-browserify');
 
export const PATCH = async (request) => {
    try {
        const {usrEmail} = await request.json();
        await connect();

        const user = await Users.findOne({usrEmail});

        if(!user){
            return NextResponse.json({ success: false, message: 'No user exists with the given Email Id...!' }, {status:404});
        }else{
            const filter = {_id:user._id};
            const resetToken = crypto.randomBytes(32).toString('hex'); //creating randow token
            const pwdResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); //hashing token in hexa-decimal
            const pwdResetTokenExpires = new Date(Date.now() + 10*60000); //creating expiring time for resetToken
    
            const tokenData = await Users.findByIdAndUpdate(filter, {pwdResetToken, pwdResetTokenExpires}, {runValidators: false});
            const resetUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}/resetpassword/${resetToken}`;  //creating a resetUrl to be sent to user.
            const message = `We have received a password reset request. Please use the below link to reset your password:<br><br><a href="${resetUrl}">${resetUrl}</a><br><br>This reset link will be valid only for 10 minutes.`;

            try {
                await sendEmail({     //sending email to user for password reset link.
                    email: user.usrEmail,
                    subject: 'Password reset request received.',
                    message: message                    
                });
            } catch (error) {
                //setting below values to undefined and saving in database if email sending fails for any reasons.
                user.pwdResetToken = undefined;
                user.pwdResetTokenExpires = undefined;
                user.save({runValidators: false});
                return NextResponse.json({ success: false, message: 'Error sending reset link...! Please try again later.' }, {status:500});
            }
            return NextResponse.json({ success: true, resetToken:resetToken, tokenData:tokenData }, {status:200});
        }

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return NextResponse.json({ success: false, message: messages }, {status:400});
          }else{
            return new NextResponse ("Error while posting data: " + error, {status: 400});
        }
    }
}