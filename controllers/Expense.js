const Expense= require("../models/Expense")
const ExpenseTracker= require("../models/ExpenseTracker")
const Income= require("../models/income")
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")
const AWS=require("aws-sdk")
const UserServices=require("../services/userservices")
const S3service=require("../services/S3services")
const allDownloads= require("../models/allDownloads")
const sequelize = require("../util/database")

function isstringinvalid(string){
  console.log(string)
  if(string.length==0){
    return true
  }
  else{
    return false
  }
}

const signup= async (req,res,next) =>{
  const t=await sequelize.transaction()
  try{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    console.log(name,email,password)
    if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
      console.log("Hi")
      return res.status(400).json({err:"Bad parameters - Something is missing"})
    }
    const saltrounds=10
    bcrypt.hash(password,saltrounds,async (err,hash)=>{
      await Expense.create({userName:name,email:email,password:hash},{transaction:t})
      res.status(201).json({message:"Successfully created a new user"})
      await t.commit()
    })
  }  
  catch(err){
    await t.rollback()
    res.status(500).json(err);
  }
}

function generateAccessToken(id,name,ispremiumuser){
  return jwt.sign({userId:id,name:name,ispremiumuser:ispremiumuser},"hi")
  
}

const signin= async (req,res,next) =>{
    
  try{
    const email=req.body.email;
    const password=req.body.password;
    if( isstringinvalid(email) || isstringinvalid(password)){
     return res.status(400).json({message:"email or password is missing",success:false,})
    }
    const user=await Expense.findAll({ where: { email} })
    if(user.length>0){
      bcrypt.compare(password,user[0].password,(err,result)=>{
        if(err){
          throw new Error("Something went wrong")
        }
        if(result === true){
            return res.status(200).json({success:true,message:"User loggedin Successfully",token:generateAccessToken(user[0].id,user[0].userName,user[0].ispremiumuser)})
        }
        else{
          return res.status(401).json({success:false,message:"Password is incorrect"})
        }
      })
    }
    else{
      return res.status(404).json({success:false,message:"User not found"})

    }
     
  }  
  catch(err){
    res.status(500).json({message:err,success:false});
  }
}

const download= async (req,res,next) =>{
  const t=await sequelize.transaction()
  try{
    const user=await Expense.findOne({where:{id:req.user.id}})
    if(user.ispremiumuser===null){
      return res.status(401).json({success:false,message:"not a premium user"})
    }
    const [expenses, incomes] = await Promise.all([
      ExpenseTracker.findAll({
        where: { userId: req.user.id }
      }),
      Income.findAll({
        where: { userId: req.user.id }
      })
    ]);
    const combined = [...expenses, ...incomes]
    const sortedTransactions = combined.sort((a, b) => {
      return new Date(a.updatedAt) - new Date(b.updatedAt);
    })  
    const stringifiedExpenses=JSON.stringify(sortedTransactions)
    const userId=req.user.id
    const filename=`Expense${userId}/${new Date()}.txt`
    console.log(expenses)
    console.log(stringifiedExpenses)
    const fileUrl=await S3service.uploadToS3(stringifiedExpenses,filename)
    const data=await allDownloads.create({date:new Date(),links:fileUrl,userId:req.user.id},{transaction:t})
    res.status(200).json({fileUrl,success:true})
    await t.commit()
  }
  catch(err){
    await t.rollback()
    console.log(err)
    res.status(500).json({fileUrl:"",success:false,err:err})
  }
}
const totaldownloads= async (req,res,next) =>{
  try{
    const user=await Expense.findOne({where:{id:req.user.id}})
    if(user.ispremiumuser===null){
      return res.status(401).json({success:false,message:"not a premium user"})
    }
    const data=await allDownloads.findAll({where:{userId:req.user.id}})
    res.status(200).json({totallinks:data,success:true})
  }
  catch(err){
    console.log(err)
    res.status(500).json({success:false,err:err})

  }
}
const ispremiumuser= async (req,res,next) =>{
  try{
    const user=await Expense.findOne({where:{id:req.user.id}})
    if(user.ispremiumuser===null){
      return res.status(401).json({success:false,message:"not a premium user"})
    }
    res.status(201).json({success:true,message:"premium user"})
  }
  catch(err){
    console.log(err)
    res.status(500).json({success:false,err:err})

  }
}

    
module.exports={
    signup,
    signin,
    download,
    totaldownloads,
    ispremiumuser
    
}