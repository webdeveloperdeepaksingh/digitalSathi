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
    ebkName:{
        type: String,
        unique: false,
    },
    ebkTags:[{
        type: String,
        unique: false 
    }],
    ebkIntro:{
        type: String,
        sparse: true,
        unique: false 
    },
    ebkDesc:{
        type: String,
        sparse: true,
        unique: false    
    },
    ebkCat:{
        type: String,
        sparse: true,
        unique: false 
    },
    ebkAuth:{
        type: String,
        sparse: true,
        unique: false 
    },
    ebkPrice:{
        type: String,
        sparse: true,
        unique: false 
    },
    ebkDisc:{
        type: String,
        sparse: true,
        unique: false 
    },
    ebkImage:{
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