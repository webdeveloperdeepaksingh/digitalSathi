import { NextResponse } from "next/server";
import connect from "../../../../server";
import Blogs from "../../../../models/Blogs";

export const GET = async (request) => {
  
  try{  

      const url = new URL(request.url);
      const query = url.searchParams.get('query');
    
      await connect ();
      let blogList = await  Blogs.find(); 

      if(query){
         blogList = blogList.filter((item)=> item.blgCat == query);
      }  

      return new NextResponse (JSON.stringify(blogList), {status: 200});

  }catch(error){
    return new NextResponse ("Error while fetching data: " + error, {status: 500});
  }
};
