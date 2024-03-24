"use client";
import React, { Suspense, useEffect, useState } from "react";
import Buy from "./Buy";
import { BASE_API_URL } from "../../../utils/constants";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import Loading from "./loading";
import { clearCart } from "../../../redux/slices/cartSlice";


function BuyProduct () {

  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(''); 
  const cartItems = useSelector((store) => store.cart);
  const [data, setData] = useState({custName:'', custEmail:'', custPhone:'', amtToPay:''})
  const [tax, setTax] = useState('');
  const settId = "65c8e1dad3c601a36e0dd62f";

  useEffect(() =>{
    async function fetchSett() {
    try 
      {
        const setting = await fetch(`${BASE_API_URL}/api/settings/${settId}`, {cache: "no-store"});
        const settingData = await setting.json();
        setTax(settingData.result);
      } catch (error) {
        console.error("Error fetching settData: ", error);
      }finally{
        setIsLoading(false);
      }
    }
    fetchSett();
  },[settId])

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
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
    let totalAmount=0.00;
    if(cartItems.items.length > 0){
      cartItems.items.map((item)=>{
        const prodDiscount = (item.prodDisc * (tax.brandDisc/100)).toFixed(2);
        const netProdAmount = (item.prodDisc - prodDiscount);
        const taxProdAmount = (netProdAmount * (Number(tax.brandTax))/100).toFixed(2);
        const finalProdPrice = Math.round((Number(netProdAmount) + Number(taxProdAmount)).toFixed(2));
        
        custProducts.push(
          {
            prodId: item._id, 
            prodName: item.prodName, 
            prodValue: finalProdPrice, 
            prodType: item.prodType, 
            prodAuth:item.prodAuth, 
            prodCont:item.prodCont, 
            prodDate:item.prodDate, 
            prodTime:item.prodTime, 
            userId:item.userId
          });
        totalAmount += parseFloat(item.prodDisc);
      });

    const discount = (totalAmount * (tax.brandDisc/100)).toFixed(2);
    const netAmount = (totalAmount - discount);
    const taxAmount = (netAmount * (Number(tax.brandTax))/100).toFixed(2);
    const amtToPay = Math.round((Number(netAmount) + Number(taxAmount)).toFixed(2));
    
    // "use server"
    const key = process.env.RAZORPAY_API_KEY;
    console.log(key);
    const response = await fetch(`${BASE_API_URL}/api/razorpay?amtToPay=${amtToPay}`);
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
          const paymentData = await fetch(`${BASE_API_URL}/api/verifypayments`, {
          method: "POST",
          body: JSON.stringify(
          {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            amtToPay: amtToPay,
            custProducts:custProducts,
            custName: data.custName,
            custEmail: data.custEmail,
            custPhone: data.custPhone
          }),
        });
        const res = await paymentData.json();
        console.log("response verify==", res);
        
        if (res?.message === "success"){
          dispatch(clearCart()); // remove the cart items from local storage.
          router.push( `/paymentsuccess?paymentid=${response.razorpay_payment_id}` );
        }
        else{
          alert("Payment failed...! Contact support for help.");
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
  };
}

if(isLoading){
  return <div>
    <Loading/>
  </div>
}

  return (
    <>
      <div className="flex flex-col p-5 h-auto">
        <div className="flex flex-col mb-3">
          <label className="mb-3">Full Name:*</label>
          <input value={data.custName} type="text" name='custName' onChange={handleChange} className="p-2 focus:outline-amber-500" placeholder="without initials..."></input>
        </div>
        <div className="flex flex-col mb-3">
          <label className="mb-3">Email:*</label>
          <input value={data.custEmail} type="email" name='custEmail' onChange={handleChange} className="p-2 focus:outline-amber-500" placeholder="kartik@gmail.com"></input>
        </div>
        <div className="flex flex-col mb-5">
          <label className="mb-3">Phone:*</label>
          <input value={data.custPhone} type="text" name='custPhone' onChange={handleChange} className="p-2 focus:outline-amber-500" placeholder="with country code e.g +91"></input>
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
