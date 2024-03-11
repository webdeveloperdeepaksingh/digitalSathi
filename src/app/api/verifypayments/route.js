import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";
import crypto from "crypto";
import Payments from "../../../../models/Payments";
import connect from "../../../../server";
import Participents from "../../../../models/Participents";

const instance = new Razorpay(
  { key_id: process.env.RAZORPAY_API_KEY, 
    key_secret: process.env.RAZORPAY_SECRET_KEY 
  });

export async function POST(req, res) {

try 
{
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amtToPay, custProducts, custName, custEmail, custPhone } = await req.json();
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  
  console.log("id==", body);

  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) 
  {
    console.log(Payments);
    await connect();
    await Payments.create({ razorpay_order_id, razorpay_payment_id, razorpay_signature, amtToPay, custProducts, custName, custEmail, custPhone });
    
    
      for (const product of custProducts) 
      {
        const { prodType, prodName, prodValue, prodAuth, prodCont, prodDate, prodTime, userId } = product;
        if(prodType === "events"){
        const custData = new Participents({ prodName, prodValue, prodAuth, prodCont, userId, prodDate, prodTime, custName, custEmail, custPhone});
        await custData.save();
        }
      } 

    return NextResponse.json({message: "success" },{ status: 200 });

  } else {
      return NextResponse.json({ message: "failed"},{ status: 400});
   }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ success: false, message: messages }, {status:400});
    }else{
      return new NextResponse ("Erron while saving data: " + error, {status: 400});
    }
  }
}
