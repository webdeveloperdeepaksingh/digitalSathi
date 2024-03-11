import { NextResponse } from "next/server";
import { Products } from "../../../../models/Products";
import Users from "../../../../models/Users";
import connect from "../../../../server";

export const GET = async (request) => {
    try{
    
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');
        const query = url.searchParams.get('query');
    
        await connect ();
        
        let user = await Users.findOne({_id:userId});
        let prodList = await  Products.find();
        let courseList = prodList.filter((item) => item.prodType === "courses");

        if(user.usrRole == 'STUDENT'){
            courseList = courseList.filter(a => a.allowAccess.some(access => access.usrId === userId));
        }
        else{
            courseList = courseList.filter(a=> user.usrRole == 'ADMIN' || a.userId == userId);
        }
        
        if (query){
            courseList = courseList.filter(a => a.prodName.toLowerCase().includes(query.toLowerCase()));
        }
        return new NextResponse (JSON.stringify(courseList), {status: 200});
    
    }catch(error){
      return new NextResponse ("Error while fetching data: " + error, {status: 500});
    }
};