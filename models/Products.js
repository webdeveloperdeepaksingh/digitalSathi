import mongoose from "mongoose";

const topSchema = new mongoose.Schema ({  
    topName:{
        type: String,
        sparse: true,
        unique: false
    },
    videoUrl:{
        type: String,
        sparse: true,
        unique: false
    },
    pdfFile:{
        type: String,
        sparse: true,
        unique: false
    }
},{timestamps: true});

const chapSchema = new mongoose.Schema ({    
    chapName:{
        type: String,
        sparse: true,
        unique: false        
    },
    chapPdf:{
        type: String,
        sparse: true,
        unique: false        
    },
    topics: [topSchema]
},{timestamps: true});

const allowSchema = new mongoose.Schema ({    
    usrId:{
        type: String,
        unique: false        
    },
    usrEmailId:{
        type: String,
        unique: false        
    },
 },{timestamps: true});

const prodSchema = new mongoose.Schema ({    
    prodName:{
        type: String,
        unique: false
    },
    prodTags:{
        type: [String],
    },
    prodIntro:{
        type: String, 
        unique: false     
    },
    prodDesc:{
        type: String,  
        unique: false      
    },
    prodCat:{
        type: String,
        unique: false
    },
    prodType:{
        type: String,
        unique:false
    },
    prodMeetLink:{
        type: String,
        unique: false
    },
    prodAuth:{
        type: String,
        unique:false
    },
    prodCont:{
        type: String,
        unique:false
    },
    prodVal:{
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
    prodTax:{
        type: String,
        unique: false 
    },
    prodTime:{
        type: String,
        unique: false 
    },
    prodDate:{
        type: String,
        unique: false 
    },
    prodDisct:{
        type: String,
        unique: false 
    },
    prodImage:{
        type: String,
        unique:false
    },
    allowAccess:[allowSchema],
    userId:{
        type: String,
        unique: false
    },
    chapters: [chapSchema]
},{timestamps: true});

const Products = mongoose.models.Products || mongoose.model("Products", prodSchema);
const Chapters = mongoose.models.Chapters || mongoose.model("Chapters", chapSchema);
const Topics = mongoose.models.Topics || mongoose.model("Topics", topSchema);
export{Products, Chapters, Topics} ;
