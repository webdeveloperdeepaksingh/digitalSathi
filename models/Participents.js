import mongoose from "mongoose";

const partSchema = new mongoose.Schema ({   
    prodName:{
        type: String,
        unique: false,     
    },
    prodValue:{
        type: String,
        unique: false,     
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
    custName:{
        type: String,
        unique: false,
    },
    custEmail:{
        type: String,
        sparse: true,
        unique: true      
    },
    custPhone:{
        type: String,
        sparse: true,
        unique: true
    },
    userId:{
        type: String,
        unique: false
    }
},{timestamps: true});

const Participents = mongoose.models.Participents || mongoose.model("Participents", partSchema);
export default Participents;