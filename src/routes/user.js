const express= require('express');
const { userAuth } = require('../middlewares/auth');
const connectionModel = require('../models/connectionRequest');
const userRoute= express.Router();

const allowed_Vals="firstName lastName photoURL age gender about skills"

userRoute.get("/user/requests/received", userAuth, async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionReq= await connectionModel.find({
            toUserID:loggedInUser._id,
            status:"interested"
        }).populate("fromUserID", allowed_Vals);

        res.json({
            message:"Req fetched successfully",
            data:connectionReq
        })
    }catch(err){
        res.status(400).send("Error: "+ err);
    }
    

})

userRoute.get("/user/connections", userAuth, async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const connectionsData= await connectionModel.find({
            $or:[
                {toUserID:loggedInUser._id, status: "accepted"},
                {fromUserID: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserID",allowed_Vals)
          .populate("toUserID",allowed_Vals)


        const data=connectionsData.map((res)=>{
            if(res.toUserID._id.toString()===loggedInUser._id.toString()){
                return fromUserID;
            }
            return toUserID;
        })

        res.json({
            message:"Fetched all connections",
            data
        })
    } catch (err) {
        res.status(400).send("Error: "+ err);
    }
})

module.exports= userRoute;
