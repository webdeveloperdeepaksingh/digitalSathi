import mongoose from "mongoose";

const catSchema = new mongoose.Schema ({    
    catName:{
        type: String,
        required: [true, 'Category name is required.'],
        unique: true,
    },
    userId:{
        type: String,
        unique: false
    }
},{timestamps: true});
const Categories = mongoose.models.Categories || mongoose.model("Categories", catSchema);
export default Categories;