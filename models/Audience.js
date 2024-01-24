import mongoose from "mongoose";

const audSchema = new mongoose.Schema ({   
     
    audName:{
        type: String,
        unique: false,
    },
    evtName:{
        type: String,
        unique: false,
        
    },
    audEmail:{
        type: String,
        sparse: true,
        unique: true 
        
    },
    audPhone:{
        type: String,
        sparse: true,
        unique: true
    },
    audPay:{
        type: String,
        unique: false
    },
    userId:{
        type: String,
        unique: false
    }
},{timestamps: true});

const Audience = mongoose.models.Audience || mongoose.model("Audience", audSchema);
export default Audience;