import connect from "../../../../../../server";
import { NextResponse } from "next/server";
import { Ebooks } from "../../../../../../models/Ebooks";


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
  
export  const  POST = async (request, {params}) =>{ 
try    
    {
      const payload = await request.json(); 
      await connect ();
  
      const ebook = await Ebooks.findById(params.EbookId)
      ebook.chapters.push(payload)
  
      const result = await ebook.save();
      return NextResponse.json({result:result, success:true}, {status: 200});
  
    }catch(error){
        return new NextResponse ("Erron posting data: " + error, {status: 500});
      }
  }