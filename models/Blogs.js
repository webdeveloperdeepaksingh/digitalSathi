import mongoose from "mongoose";

const blogSchema = new mongoose.Schema ({   
     
    blgName:{
        type: String,
        required: [true, 'Blog title is required.'],
        unique: true,
    },
    blgTags:[{
        type: String,
        unique: false 
    }],
    shortIntro:{
        type: String,
        unique: false 
    },
    blgDesc:{
        type: String,
        unique: false 
    },
    blgCat:{
        type: String,
        required: [true, 'Please select category.'],
        runValidators: true
    },
    blgAuth:{
        type: String,
        unique: false 
    },
    blgImage:{
        type: String,
        unique: false,
    },
    userId:{
        type: String,
        unique: false
    },
},{timestamps: true});
const Blogs = mongoose.models.Blogs || mongoose.model("Blogs", blogSchema);
export default Blogs;