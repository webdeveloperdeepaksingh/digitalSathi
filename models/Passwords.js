import mongoose from "mongoose";
const validator = require('validator');

const passSchema = new mongoose.Schema ({   
     
    accName:{
        type: String,
        unique: false
    },
    oldPass:{
        type: String,
        minlength: [8, 'Old Password must be at least 8 characters long.'],
        unique: false 
    },
    newPass:{
        type: String,
        minlength: [8, 'New Password must be at least 8 characters long.'],
        unique: false 
    },
    confPass:{
        type: String,
        minlength: [8, 'Confirm Password must be at least 8 characters long.'],
        unique: false,
        validate:{
            validator: function(val){
                return val == this.newPass;
            },
            message: 'Password & Confirm Password does not match!'
        }
    },
    userId:{
        type: String,
        unique: false
    }
},{timestamps: true});

passSchema.pre('save', async function(next){    
//  this.newPass = await bcrypt.hash(this.newPass, 12);
    this.confPass = undefined; //stopping confPass to be saved in db.
})

const Passwords = mongoose.models.Passwords || mongoose.model("Passwords", passSchema);
export default Passwords;