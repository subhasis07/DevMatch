
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

const validateEditProfileData=(req)=>{
    const allowed_fields=[
        "firstName",
        "lastName" , 
        "age", 
        "about", 
        "skills" ,
        "gender", 
        "photoURL"
    ];

    const isEditAllowed= Object.keys(req.body).every((field)=>{
        return allowed_fields.includes(field);
    });
    return isEditAllowed;
}

module.exports={
    signupValidator,
    validateEditProfileData
}