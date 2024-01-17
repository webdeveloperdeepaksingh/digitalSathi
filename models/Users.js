import mongoose from "mongoose";
const validator = require('validator');
const bcrypt = require('bcryptjs');


const usrSchema = new mongoose.Schema ({   
     
    usrName:{
        type: String,
        required: [true, 'User name is required!'],
        unique: false,
    },
    usrPass:{
        type: String,
        required: [true, 'Please create password.'],
        minlength: [8, 'Password must be at least 8 characters long.'],
        // select: false,
        unique: false 
    },
    usrConfPass:{
        type: String,
        required: [true, 'Please confirm password.'],
        minlength: [8, 'Confirm Password must be at least 8 characters long.'],
        unique: false,
        validate:{
            validator: function(val){
                return val == this.usrPass;
            },
            message: 'Password & Confirm Password does not match!'
        }
        
    },
    usrEmail:{
        type: String,
        required: [true, 'Email is required!'],
        lowercase: true,
        unique: true, 
        validate: [validator.isEmail, 'Please enter a valid email!']   
    },
    usrPhone:{
        type: String,
        required: [true, 'Phone is required!'],
        unique: true
    },
    usrRole:{
        type: String,
        required: [true, 'Please select user role.'],
        enum:['ADMIN', 'INSTRUCTOR', 'STUDENT'],
        default: 'STUDENT'
    }
},{timestamps: true});

usrSchema.pre('save', async function(next){
    if(!this.isModified('usrPass'))
    return next();
//encrypting password before saving to database.
    this.usrPass = await bcrypt.hash(this.usrPass, 12);
    this.usrConfPass = undefined; //stopping confPass to be saved in db.
})

const Users = mongoose.models.Users || mongoose.model("Users", usrSchema);
export default Users;