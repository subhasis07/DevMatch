const express= require('express');
const {connectDB} =require('./config/database');
const User = require('./models/users');

const app=express();


app.post("/signup", async(req,res)=>{
    const user= new User({
        firstName: "Subhasis",
        lastName:"Pal",
        emailID:"abc@gmail.com",
        password:"sub@123",
    })

    try {
        await user.save();
        res.send("user added")
    } catch (error) {
        res.status(400).send("Error while saving user")
    }
    
})

connectDB()
    .then(()=>{
        console.log("DB connected");
        app.listen(7777, ()=>{
            console.log("server connected; Port 7777");
        })
    })
    .catch((err)=>{
        console.error(err);
    })


