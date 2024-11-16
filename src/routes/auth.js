const express= require('express');
const { signupValidator } = require('../utils/validators');
const authRouter= express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');

authRouter.post("/signup", async(req,res)=>{
    try {
        //validation of incoming data
        signupValidator(req);
        const {firstName, lastName, password, emailID}= req.body;

        //encrypting password;
        const hashedPassword= await bcrypt.hash(password,10)

        const user= new User({
            firstName,
            lastName,
            emailID,
            password:hashedPassword
        });

    
        await user.save();
        res.send("user added")
    } catch (error) {
        res.status(400).send(error.message)
    }
    
})

authRouter.post("/login", async(req,res)=>{
    try {
        const{emailID, password}= req.body;
        const user =await User.findOne({emailID:emailID});
        if(!user){
            throw new Error("Invalid Creds")
        }
        const comparePassword= await user.validatePassword(password);
        if(comparePassword){

            //creating jwt token
            const token=await user.getJWT();
            // console.log(token);

            res.cookie("token",token);
            res.send("login success!!!")
        }else{
            throw new Error("Invalid creds")
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})

authRouter.post("/logout", (req,res)=>{
    res.cookie("token",null,{expire:Date.now()});
    res.send("User Logged out Successfully!!")
})

module.exports=authRouter;