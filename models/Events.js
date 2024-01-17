import mongoose from "mongoose";

const evtSchema = new mongoose.Schema ({   
     
    evtName:{
        type: String,
        required: [true, 'Event title is required.'],
        unique: true
    },
    evtTags:[{
        type: String,
        unique: false 
    }],
    shortIntro:{
        type: String,        
    },
    evtDesc:{
        type: String,      
    },
    evtCat:{
        type: String,
        required: [true, 'Category name is required.'],
    },
    evtPer:{
        type: String,
    },
    evtPhone:{
        type: String,
    },
    origPrice:{
        type: String,
    },
    discPrice:{
        type: String,
    },
    evtDate:{
        type: String,
    },
    evtTime:{
        type: String,
    },
    evtMod:{
        type: String,
    },
    evtLoc:{
        type: String,
    },
    evtImage:{
        type: String,
        unique: false
    },
    userId:{
        type: String,
        unique: false
    }
},{timestamps: true});
const Events = mongoose.models.Events || mongoose.model("Events", evtSchema);
export default Events;