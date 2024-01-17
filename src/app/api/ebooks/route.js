import { Ebooks } from "../../../../models/Ebooks";
import { NextResponse } from "next/server";
import connect from "../../../../server";


export const GET = async (request) => {
  try{

      await connect ();
      const posts = await  Ebooks.find()
      return new NextResponse (JSON.stringify(posts), {status: 200});

  }catch(error){
    return new NextResponse ("Erron while fetching data" + error, {status: 500});
  }
}

export  const  POST = async (request) =>{
  
  try  
  {
    const {ebkName, ebkIntro, ebkDesc, ebkPrice, ebkDisc, ebkAuth, ebkCat, ebkImage} = await request.json(); 
    await connect ();

    const ebook = new Ebooks({ebkName, ebkIntro, ebkDesc, ebkPrice, ebkDisc, ebkAuth, ebkCat, ebkImage});
    const result = await ebook.save();
    return NextResponse.json({result, success:true}, {status: 200});
    
  }catch(error){
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ success: false, message: messages }, {status:400});
    }else{
      return new NextResponse ("Erron while saving data" + error, {status: 400});
    }
  }
}
