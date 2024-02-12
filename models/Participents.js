import mongoose from "mongoose";

const partSchema = new mongoose.Schema ({   
     
    partName:{
        type: String,
        unique: false,
    },
    prodName:{
        type: String,
        unique: false,
        
    },
    partEmail:{
        type: String,
        sparse: true,
        unique: true 
        
    },
    partPhone:{
        type: String,
        sparse: true,
        unique: true
    },
    partPay:{
        type: String,
        unique: false
    },
    hostContact:{
        type: String,
        unique: false
    },
    userId:{
        type: String,
        unique: false
    }
},{timestamps: true});

const Participents = mongoose.models.Participents || mongoose.model("Participents", partSchema);
export default Participents;