const express= require('express');
const {connectDB} =require('./config/database');
const User = require('./models/users');
const { signupValidator } = require('./utils/validators');
const bcrypt = require('bcrypt')
const app=express();

app.use(express.json()); //Middleware to convert JSON data to js Obj & it will run in every call as no route is mentioned externally

app.post("/signup", async(req,res)=>{
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

app.post("/login", async(req,res)=>{
    try {
        const{emailID, password}= req.body;
        const user =await User.findOne({emailID:emailID});
        if(!user){
            throw new Error("Invalid Creds")
        }
        const comparePassword= await bcrypt.compare(password,user.password);
        if(comparePassword){
            res.send("login success!!!")
        }else{
            throw new Error("Invalid creds")
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.get("/user", async(req,res)=>{
    const userEmail=req.body.emailID;
    try {
        const users= await User.find({emailID:userEmail}); //findOne will result only the 1st one if there are same result of same filter
        if(users.length===0){
            res.status(404).send("No user found");
        }else{
            res.send(users);
        }
        
    } catch (error) {
        res.status(404).send("Something went wrong");
    }
})

app.get("/feed",async(req,res)=>{
    try {
        const users=await User.find({});
        if(users.length===0){
            res.status(404).send("No user found");
        }else{
            res.send(users);
        }
    } catch (error) {
        res.status(404).send("Something went wrong");
    }
})

app.delete("/user", async(req,res)=>{
    const userId= req.body.userId;
    try{
        const user= await User.findByIdAndDelete(userId);
        // const user= await User.findByIdAndDelete({_id:userId});
        res.send("User deleted successfully");
    }catch (error) {
        res.status(404).send("Something went wrong");
    }
})

app.patch("/user/:userId",async(req,res)=>{
    const data=req.body;
    const userId=req.params?.userId;

    try {
        const ALLOWED_UPDATES=["skills","photoURL","about"];
        const isUpdateAllowed=Object.keys(data).every((key)=>{
            return ALLOWED_UPDATES.includes(key);
        })
        if(!isUpdateAllowed){
            throw new Error("Update not Allowed")
        }
        if(data?.skills.length>10){
            throw new Error("Skills should not be >10")
        }

        const user= await User.findByIdAndUpdate({_id:userId}, data, {
            returnDocument:"before",
            runValidators:true,
        }); // the 3rd parameter is optional if nothing given & next line we log the user --> it will display the result before the update was done..
        console.log(user);
        res.send("user Updated successfully")
    } catch (error) {
        res.status(404).send(error.message);
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


