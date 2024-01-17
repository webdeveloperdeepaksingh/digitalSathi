import { NextResponse } from "next/server";
import connect from "../../../../../server";
import Categories from "../../../../../models/Categories";

export const GET = async (request, {params}) => {

      await connect ();
      const posts = await  Categories.find()
      const catById = posts.filter((item)=> item.id == params.CatId)
      return NextResponse.json(catById.length ==0?{result:"No Data Found", success:false} : { result:catById, success:true}, {status: 200});
}

export const PUT = async (request, {params}) =>{

      try 
      {
            const {catName} = await request.json();
            const categoryId = params.CatId;
            const filter = {_id:categoryId}
            
            await connect ();
            let posts = await Categories.findOneAndUpdate(filter, {catName});
            return NextResponse.json({result:posts, success:true}, {status:200});
      
      } catch (error) {
            return new NextResponse ("Erron while saving data" + error, {status: 500});
          }
}

export const DELETE = async (request, {params}) =>{

      try 
      {
            const categoryId = params.CatId;
            const record = {_id:categoryId}
            
            await connect ();
            let posts = await Categories.deleteOne(record);
            return NextResponse.json({posts, success:true}, {status:200});
      
      } catch (error) {
            return new NextResponse ("Erron while deleting data" + error, {status: 500});
          }
}

