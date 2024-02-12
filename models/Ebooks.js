import mongoose from "mongoose";

const chapSchema = new mongoose.Schema ({    
    chapName:{
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

const ebkSchema = new mongoose.Schema ({      
    prodName:{
        type: String,
        unique: false,
    },
    prodTags:[{
        type: String,
        unique: false 
    }],
    prodIntro:{
        type: String,
        sparse: true,
        unique: false 
    },
    prodDesc:{
        type: String,
        sparse: true,
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
        sparse: true,
        unique: false 
    },
    prodAuth:{
        type: String,
        sparse: true,
        unique: false 
    },
    prodPrice:{
        type: String,
        sparse: true,
        unique: false 
    },
    prodDisc:{
        type: String,
        sparse: true,
        unique: false 
    },
    prodImage:{
        type: String,
        unique:false
    },
    chapters: [chapSchema],
    userId:{
        type: String,
        unique: false
    }
},{timestamps: true});

const Ebooks = mongoose.models.Ebooks || mongoose.model("Ebooks", ebkSchema);
const EbookChap = mongoose.models.EbookChap || mongoose.model("EbookChap", chapSchema);
export {Ebooks, EbookChap};