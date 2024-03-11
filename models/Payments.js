import mongoose from "mongoose";
const validator = require('validator');

const prodSchema = new mongoose.Schema({
  prodId:{
    type: String,
    unique: false
  },  
  prodName:{
    type: String,
    unique: false
  },
  prodType: {
    type: String,
    unique: false
  },
  prodValue:{
    type: Number,
    unique: false
  },
  prodAuth:{
    type: String,
    unique: false
  },
  prodCont:{
    type: String,
    unique: false
  },
  prodDate:{
    type: String,
    unique: false
  },
  prodTime:{
    type: String,
    unique: false
  },
  userId:{
    type: String,
    unique: false
  }
})

const paySchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
    unique: true
  },
  razorpay_payment_id: {
    type: String,
    required: true,
    unique: true
  },
  razorpay_signature: {
    type: String,
    required: true,
    unique: false
  }, 
  amtToPay:{
    type: Number,
    unique: false
  }, 
  custName:{
    type: String,
    unique: false
  },
  custEmail:{
    type: String,
    unique: false,
  },
  custPhone:{
    type: String,
    unique: false,
  },
  custProducts:[prodSchema],
},{timestamps: true});

const Payments = mongoose.models.Payments || mongoose.model('Payments', paySchema)
export default Payments;
