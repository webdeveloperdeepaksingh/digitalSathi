import { Products } from "../../../../../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../../../../../server";


export const DELETE = async (request, {params}) =>{
    try 
      {
        await connect ();
        const ebook = await Products.findById(params.EbookId);
        
        if (!ebook) {
          return new NextResponse("No ebook found with the given ID", {status: 404});
        }
    
        ebook.chapters.pull({ _id: params.ChapId });
        await ebook.save();
    
        return new NextResponse(JSON.stringify({message: 'Chapter removed successfully.'}), {status: 200});
      }catch (error) {
          return new NextResponse ("Erron while deleting data: " + error, {status: 500});
        }       
    }