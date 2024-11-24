const Income= require("../models/income")
const totalExpensess= require("../models/Expense")
const sequelize = require("../util/database")
const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek');


function isstringvalid(string){
  if(string.length===0 || string==undefined){
    return true
  }
  else{
    return false
  }
}


const addIncome= async (req,res,next) =>{
  console.log(req.body.income)
  try{
    const income=req.body.income;
    const description=req.body.description;
    const category=req.body.category;
    if(isstringvalid(income) || isstringvalid(description) || isstringvalid(category)){
      return res.status(400).json({success:false,message:"Parameters missing"})
    }
    dayjs.extend(isoWeek);

    const currentDate = dayjs();
    const week = currentDate.isoWeek(); // ISO week number
    const year = currentDate.year();
    const date =  currentDate.format('YYYY-MM-DD');
    const month = currentDate.month() + 1;
    console.log(date,week,year)
    console.log(income,description,category)
    const data=await Income.create({income:income,description:description,category:category,userId:req.user.id,date:date,week:week,month:month,year:year})
    await res.status(201).json({newUserIncome:data,success:true});
    
  }
  catch(err){
    console.log(err)
    res.status(500).json(err)
  }
}
  
const getIncome=async (req,res,next)=>{
  try{
    console.log("Hi")
    const ITEMS_PER_PAGE_DEFAULT = 2;
    const page= +req.query.page || 1
    const pages= +req.query.pages || ITEMS_PER_PAGE_DEFAULT
    console.log(pages)
    ITEMS_PER_PAGE=pages
    const total=await Income.count({where:{userId:req.user.id}})
    totalItems=total
    const products=await Income.findAll({
      where:{userId:req.user.id},
      offset:(page-1)*ITEMS_PER_PAGE,
      limit:ITEMS_PER_PAGE
    })
    res.json({
      products:products,
      currentPage:page,
      hasNextPage:ITEMS_PER_PAGE*page< totalItems,
      nextPage:page+1,
      hasPreviousPage:page >1,
      previousPage:page-1,
      lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
    })
  } 
  catch(err){
    console.log(err)
  }
}



const deleteIncome=async (req,res,next)=>{
  try{
    const uId=req.params.id;
    if(isstringvalid(uId)){
        return res.status(400).json({success:false,message:"not an valid id"})
    }
    const noofrows=Income.destroy({where:{id:uId,userId:req.user.id}})
    if(noofrows===0){
      return res.status(404).json({success:false,message:"Expense doesnot belong to user"})
    }
    res.status(200).json({ide:uId,success:true,message:"deleted Successfully"});
  }
  catch(err){
      
    console.log(err)
    res.status(500).json({error:err,success:false,message:"failed"})
  }
}

  module.exports={
  addIncome,
  getIncome,
  deleteIncome

  }
