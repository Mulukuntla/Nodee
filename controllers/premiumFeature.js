const Users= require("../models/Expense")
const Expense= require("../models/ExpenseTracker")
const jwt=require("jsonwebtoken")
const sequelize=require("../util/database");


const getUserLeaderBoard=async (req,res,next)=>{
    try{
        const user=await Users.findOne({where:{id:req.user.id}})
        if(user.ispremiumuser===null){
            return res.status(401).json({success:false,message:"not a premium user"})
        }
        const userLeaderBoardDetails=await Users.findAll({
            order:[["totalExpenses","DESC"]]
        })
        res.status(200).json({userLeaderBoardDetails})
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports={
    getUserLeaderBoard
}