import { Ebooks } from "../../../../../../models/Ebooks";
import connect from "../../../../../../server";
import { NextResponse } from "next/server";

export const GET = async (request, {params}) => {

    try
    {
      await connect ();
      const ebook = await Ebooks.findById(params.EbookId);
  
      if (!ebook) {
        return NextResponse("No ebook found with the given ID", {status: 404});
      }  
      return NextResponse.json({result:ebook.chapters}, {status: 200});   
  
    }catch(error){
      return NextResponse ("Error fetching data: " + error, {status: 500});
    }
  }