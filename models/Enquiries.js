import mongoose from "mongoose";

const eqrSchema = new mongoose.Schema ({   
     
    eqrPerson:{
        type: String,
        unique: false
    },
    eqrSub:{
        type: String,
        unique: false
        
    },
    eqrEmail:{
        type: String,
        unique: false
        
    },
    eqrPhone:{
        type: String,
        unique: false
    },
    eqrMsg:{
        type: String,
        unique: false
    },
},{timestamps: true});
const Enquiries = mongoose.models.Enquiries || mongoose.model("Enquiries", eqrSchema);
export default Enquiries;