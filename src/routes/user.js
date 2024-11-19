const express= require('express');
const { userAuth } = require('../middlewares/auth');
const connectionModel = require('../models/connectionRequest');
const User = require('../models/users');
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

userRoute.get("/user/feed", userAuth, async(req,res)=>{

    try {
        const loggedInUser=req.user;

        const page=parseInt(req.query.page) ||1;
        let limit=parseInt(req.query.limit) ||10;
        limit= limit>50? 50 : limit;
        const skip=(page-1)*limit;

        const connections=await connectionModel.find({
            $or:[
                {fromUserID:loggedInUser._id},
                {toUserID:loggedInUser._id}
            ]
        }).select("fromUserID toUserID")

        const hideUsers=new Set();
        connections.forEach((req)=>{
            hideUsers.add(req.fromUserID._id);
            hideUsers.add(req.toUserID._id);
        })

        const usersToDisplay=await User.find({
            $and:[
                {_id:{
                    $nin:Array.from(hideUsers)
                }}
            ]
        })
        .select(allowed_Vals)
        .skip(skip)
        .limit(limit)

        req.json({data:usersToDisplay});
    } catch (error) {
        res.status(400).send("Error: "+error.message)
    }
    
})

module.exports= userRoute;
