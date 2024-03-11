import { NextResponse } from "next/server";
import connect from "../../../../server";
import {Products} from "../../../../models/Products";
import Users from "../../../../models/Users";
 

export const GET = async (request) => {
try{

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const query = url.searchParams.get('query');
    const page = url.searchParams.get('pageNbr');
    const pageSize = 20;

    await connect ();
    let user = await Users.findOne({_id:userId});
    let prodList = await  Products.find();
    let courseList = prodList.filter((item) => item.prodType === "courses");
    courseList = courseList.filter(a=> user.usrRole == 'ADMIN' || a.userId == userId);

    if (query){
        courseList = courseList.filter(a => a.prodName.toLowerCase().includes(query.toLowerCase()));
        return new NextResponse (JSON.stringify({courseList:courseList}), {status: 200});
    }else{
        const totalItems = courseList.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        courseList = courseList.slice((page - 1) * pageSize, page * pageSize);
        return new NextResponse (JSON.stringify({courseList, totalItems, totalPages}), {status: 200});
    }

}catch(error){
  return new NextResponse ("Error while fetching data: " + error, {status: 500});
}
};

export  const  POST = async (request) =>{
  
    try    
    {
      const {prodName, prodTags, prodIntro, prodType, prodAuth, prodCont, prodTax, prodDisct, prodDesc, prodCat, prodVal, prodPrice, prodDisc,  userId } = await request.json(); 
      await connect ();

      const course = new Products({prodName, prodTags, prodIntro, prodType, prodAuth,prodCont, prodTax, prodDisct, prodDesc, prodCat, prodVal, prodPrice, prodDisc, userId  });
      const result = await course.save();
      return NextResponse.json({result:result, success:true}, {status: 200});

    } catch (error) {
      return new NextResponse ("Error while saving data: " + error, {status: 500});
    }
}