import mongoose from "mongoose";

const evtSchema = new mongoose.Schema ({   
     
    prodName:{
        type: String,
        required: [true, 'Event title is required.'],
    },
    prodTags:[{
        type: String,
        unique: false 
    }],
    prodIntro:{
        type: String,
        unique: false         
    },
    prodDesc:{
        type: String,   
        unique: false    
    },
    prodType:{
        type: String, 
        unique: false      
    },
    prodTax:{
        type: String,
        unique: false 
    },
    prodDisct:{
        type: String,
        unique: false 
    },
    prodCat:{
        type: String,
        required: [true, 'Category name is required.'],
    },
    prodPer:{
        type: String,
        unique: false 
    },
    prodPhone:{
        type: String,
        unique: false 
    },
    prodPrice:{
        type: String,
        unique: false 
    },
    prodDisc:{
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
    prodMod:{
        type: String,
        unique: false 
    },
    prodLoc:{
        type: String,
        unique: false 
    },
    prodImage:{
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