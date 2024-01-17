import { Ebooks } from "../../../../../../../../models/Ebooks";
import { NextResponse } from "next/server";
import connect from "../../../../../../../../server";

export const GET = async (request, {params}) => {

    try 
      {
        await connect ();
    
        const ebook = await Ebooks.findById(params.EbookId);
        if (!ebook) {
            return new NextResponse("No ebook found with the given ID", {status: 404});
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
    
    export const PUT = async (request, {params}) =>{
    
    try 
        {
          const {chapName, pdfFile} = await request.json();
          await connect ();
          const ebook = await Ebooks.findById(params.EbookId);
    
          if (!ebook) {
              return new NextResponse("No ebook found with the given ID", {status: 404});
          }
    
          const chapter = ebook.chapters.id(params.ChapId);
          if (!chapter) {
                return new NextResponse("No chapter found with the given ID", {status: 404});
          }
    
        // Update the chapter
          Object.assign(chapter, {chapName, pdfFile});
          await ebook.save();
          return NextResponse.json({ message: 'Chapter updated successfully', success:true }, {status:200});
    
        } catch(error){
          return new NextResponse ("Erron while updating data: " + error, {status: 500});
         }
    }
    
    