const jwt=require("jsonwebtoken")
const User=require("../models/Expense")

const authenticate=(req,res,next)=>{
    try{
        const token=req.header("authorization")
        console.log(token)
        const user =jwt.verify(token,"hi")
        console.log("user------>"+user.userId)
        User.findByPk(user.userId).then(user =>{
            
            req.user=user
            next()

        }).catch(err =>{
            throw new Error(err)
        })
    }
    catch(err){
        console.log(err)
        return res.status(401).json({success:false})

    }
}

module.exports={
    authenticate
}