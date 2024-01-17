import { Ebooks } from "../../../../../models/Ebooks";
import { NextResponse } from "next/server";
import connect from "../../../../../server";


export const GET = async (request, {params}) => {
try 
      {
      await connect ();
      const ebook = await Ebooks.findById(params.EbookId);

      if (!ebook) {
            return new NextResponse("No ebook found with the given ID", {status: 404});
      }
      return NextResponse.json({result:ebook}, {status: 200});    

      }catch(error){
            return new NextResponse ("Erron while retrieving data: " + error, {status: 500});
      }
}

export const PUT = async (request, {params}) =>{

try 
   {
      const {ebkName, ebkTags, ebkIntro, ebkDesc, ebkPrice, ebkDisc, ebkAuth, ebkCat, ebkImage} = await request.json();
      const ebook = await Ebooks.findById(params.EbookId);

      if (!ebook) {
      return new NextResponse("No ebook found with the given ID", {status: 404});
      }

      // Update the ebook
      Object.assign(ebook, {ebkName, ebkTags, ebkIntro, ebkDesc, ebkPrice, ebkDisc, ebkAuth, ebkCat, ebkImage});
      await ebook.save();
      return NextResponse.json({ message: 'Ebook updated successfully', success:true }, {status:200});

   } catch (error) {
      return new NextResponse ("Erron while saving data: " + error, {status: 500});
     }
}

export const DELETE = async (request, {params}) =>{

      try 
      {
            const ebookId = params.EbookId;
            const record = {_id:ebookId}
            
            await connect ();
            let posts = await Ebooks.deleteOne(record);
            return NextResponse.json({posts, success:true}, {status:200});
      
      } catch (error) {
            return new NextResponse ("Erron while deleting data: " + error, {status: 500});
          }
}

