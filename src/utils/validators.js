
const validates=require('validator')

const signupValidator=(req)=>{
    const {firstName, lastName, password, emailID}= req.body;

    if(!firstName || !lastName){
        throw new Error("Enter correct name!");
    }else if(!validates.isEmail(emailID)){
        throw new Error("Enter correct Email")
    }else if(!validates.isStrongPassword(password)){
        throw new Error("Enter String Password")
    }

}

module.exports={
    signupValidator
}