"use client";
import React, { Suspense, useState } from "react";
import Buy from "./Buy";
import { useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

const BuyProduct = () => {

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(''); 
  const cartItems = useSelector((store) => store.cart);
  const [data, setData] = useState({custName:'', custEmail:'', custPhone:''})
 
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(name, value);
    setData((prev) =>{
    return {
        ...prev, [name]: value
    }
  }); 
}

  const makePayment = async () => {
  setErrorMessage(''); //Clear the previous error
  let errMsg=[];
    if(!data.custName.trim()){
      errMsg.push("Full Name is required.");
    }

    if(!data.custEmail.trim()){
      errMsg.push("Email is required.");
    }

    if(!data.custPhone.trim()){
      errMsg.push("Phone is required.");
    }

    if(errMsg.length > 0){
      setErrorMessage(errMsg.join(" | "));
      return false;
    }

    let custProducts = [];
    let totalAmount=0;
    if(cartItems.items.length > 0){
      cartItems.items.map((item)=>{
        custProducts.push(
          {
            prodId: item._id,
            prodName: item.prodName,  
            prodValue: item.prodDisc,
            prodType: item.prodType
          });
        totalAmount+=parseInt(item.prodDisc);
      });
    }
    // "use server"
    const key = process.env.RAZORPAY_API_KEY;
    console.log(key);
    // Make API call to the serverless API
    const response = await fetch("http://localhost:3000/api/razorpay?totalAmount="+totalAmount);
    const { order } = await response.json();
    console.log(order.id);
    const options = {
      key: key,
      name: "digitalsathi",
      currency: order.currency,
      amount: order.amount,
      order_id: order.id,
      description: "DigitalSathi Purchase Order",
      // image: logoBase64,
      handler: async function (response) {
          console.log(response);
          const paymentData = await fetch("http://localhost:3000/api/verifypayments", {
          method: "POST",
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            custProducts:custProducts,
            custName: data.custName,
            custEmail: data.custEmail,
            custPhone: data.custPhone
          }),
        });

        const res = await paymentData.json();
        console.log("response verify==", res);

        if (res?.message == "success"){
            // remove the cart items from local storage.
          localStorage.removeItem("cartItems");
          router.push( "/paymentsuccess?paymentid=" + response.razorpay_payment_id );
        }else{
          if (Array.isArray(post.message)) {
            setErrorMessage(post.message.join(' || '));
            }else{
              setErrorMessage(post.message);
          } 
        }
      },
      prefill: {
        name: "digitalsathi",
        email: "coachdeepaksingh@gmail.com",
        contact: "7607146249",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function (response) {
      alert("Payment failed...! Contact support for help.");
    });
  };

  return (
    <>
      <div className="flex flex-col p-5">
        <div className="flex flex-col mb-3">
          <label className="mb-3">Full Name:*</label>
          <input value={data.custName} type="text" name='custName' onChange={handleChange} className="p-2 focus:outline-amber-600" placeholder="without initials..."></input>
        </div>
        <div className="flex flex-col mb-3">
          <label className="mb-3">Email:*</label>
          <input value={data.custEmail} type="email" name='custEmail' onChange={handleChange} className="p-2 focus:outline-amber-600" placeholder="kartik@gmail.com"></input>
        </div>
        <div className="flex flex-col mb-5">
          <label className="mb-3">Phone:*</label>
          <input value={data.custPhone} type="text" name='custPhone' onChange={handleChange} className="p-2 focus:outline-amber-600" placeholder="with country code e.g +91"></input>
        </div>
        {errorMessage && <p className='text-red-600 italic '>{errorMessage}</p>}
        <Suspense fallback={<Loading />}>
          <Buy makePayment={makePayment} />
        </Suspense>
      </div>
    </>
  );
};

export default BuyProduct;