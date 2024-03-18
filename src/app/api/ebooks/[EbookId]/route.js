import { Products } from "../../../../../models/Products";
import Users from "../../../../../models/Users";
import { NextResponse } from "next/server";
import connect from "../../../../../server";


export const GET = async (request, {params}) => {
try 
   {
      await connect ();
      const ebook = await Products.findById(params.EbookId);

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
      const {prodName, prodIntro, prodTags, prodDesc, prodPrice,  prodTax, prodDisct, prodDisc, prodAuth, prodCat, prodImage, studentEmailIds, allowAccess } = await request.json();
      const ebook = await Products.findById(params.EbookId);

      if (!ebook) {
      return new NextResponse("No ebook found with the given ID", {status: 404});
      }

      if(allowAccess === "Allowed")
      {
            for(var stu in studentEmailIds){
                  let uem = studentEmailIds[stu];
                  let user = await Users.findOne({usrEmail:uem});
                  if(user){
                        ebook.allowAccess.push({usrId:user._id, usrEmailId:uem});      
                  }else{
                        return NextResponse.json({ message: `No user exists with this email: ${uem}`, success: false  }, {status:404});
                  }
            }     
            Object.assign(ebook);
      }
      else if(allowAccess === "Disallowed"){
            for(var stu in studentEmailIds){
                  let uem = studentEmailIds[stu];
                  let user=await Users.findOne({usrEmail:uem});
                  if(user){
                        ebook.allowAccess.pop(user._id);      
                  }
            }   
            Object.assign(ebook);
      }
      else if(allowAccess !== "noaction") {
            // Update the course
            Object.assign(ebook, {prodName, prodTags, prodAuth, prodIntro, prodTax, prodDisct,  prodDesc, prodCat, prodPrice, prodDisc, prodImage });
      }
      await ebook.save();
      return NextResponse.json({ message: 'Ebook updated successfully', success:true }, {status:200});

   } catch (error) {
      return new NextResponse ("Error while saving data: " + error, {status: 500});
     }
}

export const DELETE = async (request,{params}) =>{

try 
{
      const ebookId = params.EbookId;
      const record = {_id:ebookId}
      
      await connect ();
      let posts = await Products.deleteOne(record);
      return NextResponse.json({posts, success:true}, {status:200});
      
} catch (error) {
      return new NextResponse ("Erron while deleting data: " + error, {status: 500});
      }
}

