import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema ({   
     
    brandTitle:{
        type: String,
        required: [true, 'User name is required!'],
        unique: false,
    },
    brandTags:[{
        type: String,
        unique: false    
    }],
    brandIntro:{
        type: String,
        unique: false        
    },
    brandCurr:{
        type: String,
        required: [true, 'Currency is required!'],
        unique: false
    },
    brandTax:{
        type: String,
        required: [true, 'Tax rate is required!'],
        unique: false
    },
    brandDisc:{
        type: Number,
        unique: false
    },
    brandLogo:{
        type: String,
        unique: false
    },
    brandIcon:{
        type: String,
        unique: false
    },
    brandBanner:{
        type: String,
        unique: false
    },
},{timestamps: true});

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
export default Settings;