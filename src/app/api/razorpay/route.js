import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });

export async function GET(request) {
                
  const url = new URL(request.url);
  const totalAmount = url.searchParams.get('totalAmount');
  const payment_capture = 1;
  const amount = parseInt(totalAmount) * 100 // amount in paisa. In our case it's INR 1
  const currency = "INR";
  const options = {
      amount: (amount).toString(),
      currency,
      receipt: shortid.generate(),
      payment_capture
    };
   const order = await instance.orders.create(options);
   return NextResponse.json({ msg: "success",order });
}

export async function POST(req) {

  const body = await req.json();
  return NextResponse.json({ msg: body });
  
}
