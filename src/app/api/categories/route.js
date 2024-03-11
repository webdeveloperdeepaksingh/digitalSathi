import { NextResponse } from "next/server";
import connect from "../../../../server";
import Categories from "../../../../models/Categories";
 
export const GET = async (request) => {  

  try{
    
      const url = new URL(request.url);
      const query = url.searchParams.get('query');
      const page = url.searchParams.get('pageNbr');
      const pageSize = 20;
      await connect ();

      let posts = await  Categories.find();
      
      if (query){
        posts = posts.filter(a => a.catName.toLowerCase().includes(query.toLowerCase()));
        return new NextResponse (JSON.stringify({posts:posts}), {status: 200});
      }else{
        if(page){
          const totalItems = posts.length;
          const totalPages = Math.ceil(totalItems / pageSize);
          posts = posts.slice((page - 1) * pageSize, page * pageSize);
          return new NextResponse (JSON.stringify({posts, totalItems, totalPages}), {status: 200});
        }
        else{
          return new NextResponse (JSON.stringify(posts), {status: 200});
        }        
      }
      
  }catch(error){
    return new NextResponse ("Error while fetching data: " + error, {status: 500});
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
