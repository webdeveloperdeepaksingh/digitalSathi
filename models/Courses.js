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
    topics: [topSchema]
},{timestamps: true});

const coSchema = new mongoose.Schema ({    
    coName:{
        type: String,
        required: [true, 'Course title is required.'],
        unique: true,
    },
    coTags:[{
        type: String,
        unique: false 
    }],
    coIntro:{
        type: String,     
    },
    coDesc:{
        type: String,       
    },
    coCat:{
        type: String,
        required: [true, 'Category name is required.'],
    },
    coVal:{
        type: String,
    },
    coPrice:{
        type: String,
    },
    coDisc:{
        type: String,
    },
    coImage:{
        type: String,
        unique:false
    },
    userId:{
        type: String,
        unique: false
    },
    chapters: [chapSchema]
},{timestamps: true});

const Courses = mongoose.models.Courses || mongoose.model("Courses", coSchema);
const Chapters = mongoose.models.Chapters || mongoose.model("Chapters", chapSchema);
const Topics = mongoose.models.Topics || mongoose.model("Topics", topSchema);

export  { Courses, Chapters, Topics };
