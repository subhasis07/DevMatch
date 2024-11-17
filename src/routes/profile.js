const express= require('express');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validators');
const profileRouter= express.Router();

profileRouter.get("/profile/view", userAuth, async(req,res)=>{

    try {
        const loggedInUser=req.user;
        res.send(loggedInUser)

        // console.log(cookies);
    } catch (error) {
        res.status(400).send(error.message)
    }
    
})

profileRouter.patch("/profile/edit",userAuth, async(req,res)=>{
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Edit Not successful");
        }
        const loggedInUser=req.user;
        Object.keys(req.body).forEach((key)=>{
            loggedInUser[key]=req.body[key];

        })

        await loggedInUser.save();

        // res.send(`${loggedInUser.firstName}, Your profile has been updated successfully`)
        res.json({
            message:`${loggedInUser.firstName}, Your profile has been updated successfully`,
            data: loggedInUser
        })
    } catch (error) {
        res.status(400).send("Error: "+error.message)
    }   
})

profileRouter.patch("/profile/edit/changepassword", userAuth, async(req,res)=>{
    try {
        const loggedInUser= req.user;
        const {oldPassword, newPassword}= req.body;

        const checkOldPassword= await user.validatePassword(oldPassword);
        if(!checkOldPassword){
            return res.send(400).json({
                message:"Old Password is not correct"
            })
        }
        if(oldPassword==newPassword){
            return res.send(400).json({
                message:"Old & new Password cannot be same"
            })
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password,10)

        // Update the user's password
        loggedInUser.password = hashedPassword;
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your password has been updated successfully`,
        });
    } catch (error) {
        res.status(404).send("Error: "+error.message)
    }

})
module.exports=profileRouter;