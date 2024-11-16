const jwt= require("jsonwebtoken");
const User = require("../models/users");
const userAuth= async(req,res,next)=>{
    try{

        //finding token
        const {token}= req.cookies;
        if(!token){
            throw new Error("Invalid Token!")
        }

        //validating token
        const validateObj= jwt.verify(token,"secretID")

        //check id
        const {_id}=validateObj;
        const loggedUser= await User.findById(_id);
        if(!loggedUser){
            throw new Error("No user found");
        }

        //pass the id in req
        req.user=loggedUser;
        next();
    }catch(err){
        res.status(400).send("Error: "+err.message)
    }
}

module.exports={userAuth}