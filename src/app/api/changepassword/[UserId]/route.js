import { NextResponse } from "next/server";
import connect from "../../../../../server";
import Users from "../../../../../models/Users";

const bcrypt = require('bcryptjs');

export const PUT = async (req, res, {params}) =>{

try {
        const {oldPass, newPass, confPass} = req.json();
        const userId = params.UserId;
        const filter = {_id:userId}
            
        await connect ();
        let user = await Users.findById(userId);

        //Check if supplied old password matches with existing password.
        if(!(await bcrypt.compare(oldPass, user.usrPass))){
            return NextResponse.json({ success: false,  message: 'Invalid old password...!' }, {status:400});
        }else{
            if(!(newPass === confPass)){
                return NextResponse.json({ success: false,  message: 'New Password & Confirm Password does not match...!' }, {status:400});
            }else{
                user.usrPass = await bcrypt.hash(newPass, 12);
                const passSaved = await Users.updateOne(user);
                return NextResponse.json({result:passSaved, success:true}, {status:200});
            }          
        }
    } catch (error) {
        return new NextResponse ("Error while saving data: " + error, {status: 500});
    }
}