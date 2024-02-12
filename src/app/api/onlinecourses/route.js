import { NextResponse } from "next/server";
import connect from "../../../../server";
import { Products } from "../../../../models/Products";

export const GET = async (request) => {
  
  try{  

      const url = new URL(request.url);
      const query = url.searchParams.get('query');``
    
      await connect ();
      let prodList = await  Products.find();
      let courseList = prodList.filter((item) => item.prodType === "courses"); 

      if(query){
         courseList = courseList.filter((item)=> item.prodCat == query);
      }  

      return new NextResponse (JSON.stringify(courseList), {status: 200});

  }catch(error){
    return new NextResponse ("Error while fetching data: " + error, {status: 500});
  }
};
