import connect from "../../../../../server";
import Blogs from "../../../../../models/Blogs";
import { NextResponse } from "next/server";

export const GET = async (request, {params}) => {
try 
  {
      await connect ();
      const blog = await Blogs.findById(params.BlogId);
      if (!blog) {
      return new NextResponse("No blog found with the given ID", {status: 404});
      }
      return NextResponse.json({result:blog}, {status: 200});    

   }catch(error){
      return new NextResponse ("Error while retrieving data: " + error, {status: 500});
   }
}

export const PUT = async (request, {params}) =>{

      try 
      {
            const {blgName, blgTags, shortIntro, blgDesc, blgCat, blgAuth, blgImage} = await request.json();
            const blogId = params.BlogId;
            const filter = {_id:blogId}
            await connect ();

            const existingBlog = await Blogs.findOne({blgName: blgName,  _id: {$ne: blogId}});
      
            if(existingBlog){
            return NextResponse.json({ success: false, message: 'Blog title already exists !' }, {status:400});
            }else{
            const posts = await Blogs.findOneAndUpdate(filter, {blgName, blgTags, shortIntro, blgDesc, blgCat, blgAuth, blgImage});
            return NextResponse.json({result:posts, success:true}, {status:200});
            }
      
      } catch (error) {
            return new NextResponse ("Error while saving data" + error, {status: 500});
          }
}

export const DELETE = async (request, {params}) =>{

      try 
      {
            const blogId = params.BlogId;
            const record = {_id:blogId}
            
            await connect ();
            let posts = await Blogs.deleteOne(record);
            return NextResponse.json({posts, success:true}, {status:200});
      
      } catch (error) {
            return new NextResponse ("Erron while deleting data" + error, {status: 500});
          }
}

