import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema ({   
     
    webTitle:{
        type: String,
        required: [true, 'User name is required!'],
        unique: false,
    },
    webTags:[{
        type: String,
        unique: false    
    }],
    metaData:{
        type: String,
        unique: false        
    },
    webCurr:{
        type: String,
        required: [true, 'Currency is required!'],
        unique: false
    },
},{timestamps: true});

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);
export default Settings;