const express=require('express');
const { userAuth } = require('../middlewares/auth');
const connectionRouter= express.Router();

connectionRouter.post("/sendConnectionReq", userAuth, (req,res)=>{
    //logic
    const user=req.user;
    // console.log("connection sent");
    res.send(user.firstName+" sent a request")
})

module.exports=connectionRouter;