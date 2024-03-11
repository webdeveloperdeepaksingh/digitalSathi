import { NextResponse } from "next/server";
import connect from "../../../../../../../server";
import { Products } from "../../../../../../../models/Products";


export const GET = async (request, {params}) => {

    try 
      {
        await connect ();
        const ebook = await Products.findById(params.EbookId);
    
        if (!ebook) {
            return new NextResponse("No course found with the given ID", {status: 404});
        }
    
        const chapter = ebook.chapters.id(params.ChapId);
        if (!chapter) {
            return new NextResponse("No chapter found with the given ID", {status: 404});
        }
    
        return NextResponse.json({result:chapter}, {status: 200});  
    
      }catch(error){
            return new NextResponse ("Erron while retrieving data: " + error, {status: 500});
          }
    }