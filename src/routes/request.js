const express=require('express');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/users');
const connectionReqModel = require('../models/connectionRequest');
const connectionRouter= express.Router();

connectionRouter.post("/request/send/:status/:toUserID", userAuth, async(req,res)=>{
    try {
        const fromUserID=req.user._id;
        const toUserID=req.params.toUserID;
        const status=req.params.status;


        //checking only these two status code should be present
        const allowed_Status=["interested","ignored"];

        if(!allowed_Status.includes(status)){
            return res.status(400).json({
                message:"Invalid Status: " + status
            })
        }


        //checking the toUser is available or not in User db
        const toUser=await User.findOne({_id: toUserID});
        if(!toUser){
            return res.status(400).json({
                message:"User not found"
            })
        }

        //checking if A sends to B; then B should not send req to A again
        const existingConnectionReq=await connectionReqModel.findOne({
            $or:[
                {fromUserID, toUserID},
                {fromUserID:toUserID, toUserID:fromUserID}
            ]
        }) 

        if(existingConnectionReq){
            return res.json({
                message: "Connection req already exist" 
            })
        }

        //saving the connection req in DB
        const connectionRequest= new connectionReqModel({
            fromUserID,
            toUserID,
            status
        });

        const data= await connectionRequest.save();

        res.json({
            message:req.user.firstName + " is " + status + " in " + toUser.firstName,
            data
        })
    } catch (error) {
       res.status(404).send("Error: "+error.message) 
    }


})

module.exports=connectionRouter;