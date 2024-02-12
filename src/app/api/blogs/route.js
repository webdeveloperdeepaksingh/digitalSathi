import { NextResponse } from "next/server";
import connect from "../../../../server";
import Blogs from "../../../../models/Blogs";
import Users from "../../../../models/Users";

export const GET = async (request, response, next) => {
  
  try{

      const url = new URL(request.url);
      const userId=url.searchParams.get('userId');
      const query = url.searchParams.get('query');
      
      await connect ();
      let user=await Users.findOne({_id:userId});
      let posts = await  Blogs.find();

      posts=posts.filter(a=> user.usrRole == 'ADMIN' || a.userId == userId);
      if (query){
        posts = posts.filter(a => a.blgName.toLowerCase().includes(query.toLowerCase()));
      }
      return new NextResponse (JSON.stringify(posts), {status: 200});

  }catch(error){
    return new NextResponse ("Erron while fetching data: " + error, {status: 500});
  }
};

export  const  POST = async (request) =>{ 
  try  
    {
      const {blgName,blgTags, shortIntro, blgDesc, blgCat, blgAuth, blgImage, userId} = await request.json(); 
      await connect ();

      const existingBlog = await Blogs.findOne({blgName});
      
      if(existingBlog){
        return NextResponse.json({ success: false, message: 'Blog title already exists !' }, {status:400});
      }else{
        const blog = new Blogs({blgName, blgTags, shortIntro, blgDesc, blgCat, blgAuth, blgImage, userId});
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
