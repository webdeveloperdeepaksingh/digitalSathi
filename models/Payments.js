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
  custProducts:[prodSchema],  
  custName:{
    type: String,
    unique: false
  },
  custEmail:{
    type: String,
    unique: false,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email...!`
    }
  },
  custPhone:{
    type: String,
    unique: false,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number...!`
    }
  }
},{timestamps: true});

const Payments = mongoose.models.Payments || mongoose.model('Payments', paySchema)
export default Payments;
