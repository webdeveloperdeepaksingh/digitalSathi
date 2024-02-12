import mongoose from "mongoose";

const proSchema = new mongoose.Schema ({   
     
    proName:{
        type: String,
        unique: false
    },
    proFather:{
        type: String,
        unique: false
    },
    proDob:{
        type: String,
        unique: false
    },
    proJob:{
        type: String,
        unique: false
    },
    proQual:{
        type: String,
        unique: false
    },
    shortIntro:{
        type: String,
        unique: false        
    },
    proAbout:{
        type: String,
        unique: false      
    },
    proPloc:{
        type: String,
        unique: false,
    },
    proCloc:{
        type: String,
        unique: false,
    },
    proAdd:{
        type: String,
        unique: false,
    },
    proId:{
        type: String,
        unique: false,
    },
    proImage:{
        type: String,
        unique: false,
    },
    userId:{
        type: String,
        unique: false
    }
},{timestamps: true});

const Profiles = mongoose.models.Profiles || mongoose.model("Profiles", proSchema);
export default Profiles;