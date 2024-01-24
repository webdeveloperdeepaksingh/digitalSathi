import { NextResponse } from "next/server";
import connect from "../../../../server";
import Categories from "../../../../models/Categories";
import Users from "../../../../models/Users";

export const GET = async (request, response, next) => {
  
  try{

      const url = new URL(request.url);
      const userId=url.searchParams.get('userId');
      await connect ();
      let user = await Users.findOne({_id:userId});
      let posts = await  Categories.find();
      posts = posts.filter(a=> user.usrRole == 'ADMIN' || a.userId == userId);
      return new NextResponse (JSON.stringify(posts), {status: 200});

  }catch(error){
    return new NextResponse ("Erron while fetching data: " + error, {status: 500});
  }
};

export  const  POST = async (request) =>{ 
  try  
    {
 
      const {catName, userId} = await request.json(); 
      await connect ();

      const existingCatName = await Categories.findOne({catName});

      if (existingCatName) {
        return NextResponse.json({ success: false,  message: 'Category name already exists !' }, {status:400});
      }
      else
      {
        const category = new Categories({catName, userId});
        const result = await category.save();
        return NextResponse.json({result, success:true}, {status: 200});
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
