const mongoose= require('mongoose');
const validate=require('validator');
const jwt= require("jsonwebtoken");
const bcrypt = require('bcrypt')

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3
    },
    lastName:{
        type:String,
    },
    emailID:{
        type:String,
        required: true,
        lowercase:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validate.isEmail(value)){
                throw new Error("Invalid Email ID")
            }
        }
    },
    password:{
        type:String,
        required: true,
        validate(value){
            if(!validate.isStrongPassword(value)){
                throw new Error("Enter a strong Password")
            }
        }
    },
    age:{
        type:Number,
        min:17
    },
    gender:{
        type:String,
        validate(value){  // by default this validator will work only during creating new user ; to apply this validators during updating user, we need to apply options in app.js->patch api -> runValidators:true
            if(!["male","female", "other"].includes(value)){
                throw new Error("Gender not found");
            }
        }
    },
    about:{
        type:String,
        default:" Default About",
    },
    photoURL:{
        type:String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
        validate(value){
            if(!validate.isURL(value)){
                throw new Error("Invalid Photo URL")
            }
        }
    },
    skills:{
        type:[String]
    }
},{
    timestamps:true,
})

userSchema.methods.getJWT=async function(){
    const user=this;

    const jwtPass= await jwt.sign({_id:user._id},"secretID",{expiresIn:"1d"})
    return jwtPass;
}

userSchema.methods.validatePassword=async function (inputPassword) {

    const isPassValid= bcrypt.compare(inputPassword,this.password);
    return isPassValid;
}

const User = mongoose.model("User",userSchema);
module.exports= User;

//module.exports = mongoose.model("User",userSchema);