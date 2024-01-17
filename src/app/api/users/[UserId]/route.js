import Users from "../../../../../models/Users";
import { NextResponse } from "next/server";
import connect from "../../../../../server";


export const GET = async (request, {params}) => {

      await connect ();
      const posts = await  Users.find()
      const userById = posts.filter((item)=> item.id == params.UserId)
      return NextResponse.json(userById.length ==0?{result:"No Data Found", success:false} : { result:userById, success:true}, {status: 200});
}

export const PUT = async (request, {params}) =>{

      try 
      {
            const {usrName, usrPass, usrEmail, usrPhone, usrRole} = await request.json();
            const userId = params.UserId;
            const filter = {_id:userId}
            
            await connect ();

            const existingEmail = await Users.findOne({ usrEmail});
            const existingPhone = await Users.findOne({ usrPhone});
      
            if (existingEmail) {
                  return NextResponse.json({ success: false,  message: 'This email is already registered !' }, {status:400});
            }
            
            if(existingPhone){
                  return NextResponse.json({ success: false, message: 'This phone is already registered !' }, {status:400});
            }else{
                  const posts = await Users.findOneAndUpdate(filter, {usrName, usrPass, usrEmail, usrPhone, usrRole});
                  return NextResponse.json({result:posts, success:true}, {status:200});
            }
      } catch (error) {
            return new NextResponse ("Erron while saving data" + error, {status: 500});
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

