import { NextResponse } from "next/server";
import connect from "../../../../server";
import Blogs from "../../../../models/Blogs";

export const GET = async (request) => {
  
  try{

      await connect ();
      const posts = await  Blogs.find()
      return new NextResponse (JSON.stringify(posts), {status: 200});

  }catch(error){
    return new NextResponse ("Erron while fetching data" + error, {status: 500});
  }
}

export  const  POST = async (request) =>{ 
  try  
    {
      const {blgName, shortIntro, blgDesc, blgCat, blgAuth, blgImage, userId} = await request.json(); 
      await connect ();

      const existingBlog = await Blogs.findOne({blgName});
      
      if(existingBlog){
        return NextResponse.json({ success: false, message: 'Blog title already exists !' }, {status:400});
      }else{
        const blog = new Blogs({blgName, shortIntro, blgDesc, blgCat, blgAuth, blgImage});
        const result = await blog.save();
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
