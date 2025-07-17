const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({        
email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    
    phoneNumber: {
        type: String,
        required: true
    },
    yourLostItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LostItem'
    }],
    yourFoundItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoundItem'
    }],
    profilepic: {
        data: Buffer,
        contentType: String
    },
    roomid:[{
        type:String
    }],

    
    
    
   

});
userSchema.statics.hashPassword=function(password){
    return bcrypt.hashSync(password,10);
}   
userSchema.methods.comparePassword=function(password,hash){
    return bcrypt.compareSync(password,hash);
}
userSchema.methods.createToken=function(){
    const token=jwt.sign({email:this.email},process.env.JWT_SECRET,{expiresIn:"1h"});
    return token;
}


const user=mongoose.model("User",userSchema);

module.exports=user;