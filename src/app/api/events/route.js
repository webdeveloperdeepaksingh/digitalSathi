import { Products } from "../../../../models/Products";
import { NextResponse } from "next/server";
import connect from "../../../../server";
import Users from "../../../../models/Users";


export const GET = async (request) => {
try
  {

    const url = new URL(request.url);
    const userId=url.searchParams.get('userId');
    const query = url.searchParams.get('query');
    const page = url.searchParams.get('pageNbr');
    const pageSize = 20;

    await connect ();
    let user=await Users.findOne({_id:userId});
    let prodList = await  Products.find();
    let eventList = prodList.filter((item) => item.prodType === "events");

    eventList = eventList.filter(a=> user.usrRole == 'ADMIN' || a.userId == userId);

    if (query){
      eventList = eventList.filter(a => a.prodName.toLowerCase().includes(query.toLowerCase()));
      return new NextResponse (JSON.stringify({eventList:eventList}), {status: 200});
    }else{
      const totalItems = eventList.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      eventList = eventList.slice((page - 1) * pageSize, page * pageSize);
      return new NextResponse (JSON.stringify({eventList, totalItems, totalPages}), {status: 200});
    }

  }catch(error){
    return new NextResponse ("Error while fetching data: " + error, {status: 500});
  }
};

export  const  POST = async (request) =>{ 
  try  
    {
      const {prodName, prodIntro, prodMeetLink, prodType, prodTax, prodAuth, prodCont, prodDisct, prodTags, prodDesc, prodCat, prodPrice, prodDisc, prodTime, prodDate, userId } = await request.json(); 

      await connect ();   
      const event = new Products({prodName, prodIntro, prodMeetLink, prodType, prodTax, prodAuth, prodCont, prodDisct, prodTags, prodDesc, prodCat, prodPrice, prodDisc, prodTime, prodDate, userId});
      const result = await event.save();
      return NextResponse.json({result, success:true}, {status: 200});
      
    }catch(error){
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return NextResponse.json({ success: false, message: messages }, {status:400});
      }else{
        return new NextResponse ("Erron while saving data: " + error, {status: 400});
      }
    }
}
