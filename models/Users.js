import mongoose from "mongoose";
import validator from "validator";

const bcrypt = require('bcryptjs');
const usrSchema = new mongoose.Schema ({   
     
    usrName:{
        type: String,
        unique: false,
    },
    usrPass:{
        type: String,
        minlength: [8, 'Password must be at least 8 characters long.'],
        runValidators: true,
        unique: false 
    },
    confPass:{
        type: String,
        minlength: [8, 'Confirm Password must be at least 8 characters long.'],
        runValidators: true,
        unique: false,
        validate:{
            validator: function(val){
                return val == this.usrPass;
            },
            message: 'Password & Confirm Password does not match...!'
        }
    },
    usrEmail:{
        type: String,
        lowercase: true,
        unique: true, 
        validate: [validator.isEmail, 'Please enter a valid email.']   
    },
    usrPhone:{
        type: String,
        unique: true
    },
    usrRole:{
        type: String,
    },
    pwdResetToken: String,
    pwdResetTokenExpires: Date
},{timestamps: true});

usrSchema.pre('save', async function(next){    
    if(this.isModified('usrPass')){
        this.usrPass = await bcrypt.hash(this.usrPass, 12);
     }
    this.confPass = undefined; //stopping confPass to be saved in db.
    next();
});

const Users = mongoose.models.Users || mongoose.model("Users", usrSchema);
export default Users;