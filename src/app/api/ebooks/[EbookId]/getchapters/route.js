import { Products } from "../../../../../../models/Products";
import connect from "../../../../../../server";
import { NextResponse } from "next/server";

export const GET = async (request, {params}) => {

try
  {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');

    await connect ();
    const ebook = await Products.findById(params.EbookId);

    if (!ebook) {
      return NextResponse("No ebook found with the given ID", {status: 404});
    } 
    
    let chapList = ebook.chapters;
    if (query){
        chapList = chapList.filter(a => a.chapName.toLowerCase().includes(query.toLowerCase()));
    } 
    return NextResponse.json({result:chapList}, {status: 200});   
  
  }catch(error){
      return NextResponse ("Error fetching data: " + error, {status: 500});
    }
  }