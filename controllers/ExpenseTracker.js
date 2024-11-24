const Expense= require("../models/ExpenseTracker")
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

const addExpense= async (req,res,next) =>{
  const t=await sequelize.transaction()
  try{
    const expense=req.body.expense;
    const description=req.body.description;
    const category=req.body.category;
    if(isstringvalid(expense) || isstringvalid(description) || isstringvalid(category)){
      return res.status(400).json({success:false,message:"Parameters missing"})
    }
    dayjs.extend(isoWeek);
    const currentDate = dayjs();
    const week = currentDate.isoWeek(); // ISO week number
    const year = currentDate.year();
    const date =  currentDate.format('YYYY-MM-DD');
    const month = currentDate.month() + 1;
    const data=await Expense.create({expense:expense,description:description,category:category,userId:req.user.id,date:date,week:week,month:month,year:year},{transaction:t})
    const totalExpen=Number(req.user.totalExpenses)+Number(expense)
    console.log(totalExpen)
    await totalExpensess.update({
      totalExpenses:totalExpen
      },
      {
      where:{id:req.user.id},
      transaction:t
    })
    await res.status(201).json({newUserDetail:data,success:true});
    await t.commit()
  }
  catch(err){
    await t.rollback()
    console.log(err)
    res.status(500).json(err)
  }
}


const getExpense=async (req,res,next)=>{
  try{
    console.log("Hi")
    const ITEMS_PER_PAGE_DEFAULT = 2;
    const page= +req.query.page || 1
    const pages= +req.query.pages || ITEMS_PER_PAGE_DEFAULT
    console.log(pages)
    ITEMS_PER_PAGE=pages
    const total=await Expense.count({where:{userId:req.user.id}})
    totalItems=total
    const products=await Expense.findAll({
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
    res.status(500).json({error:err,success:false,message:"failed"})
    console.log(err)
  }
}

const deleteExpense= async (req,res) => {
  const t=await sequelize.transaction()  
  try{
    console.log("id--------->",req.params.id)  
    const uId=req.params.id;
    const expense=await Expense.findOne({where:{id:req.params.id}})
    console.log(expense.expense)
    const user=await totalExpensess.findOne({where:{id:req.user.id}})
    var expenses=Number(user.totalExpenses)-Number(expense.expense)
    await user.update({totalExpenses:expenses},{transaction:t})
    if(isstringvalid(uId)){
      return res.status(400).json({success:false,message:"not an valid id"})
    }
    Expense.destroy({where:{id:uId,userId:req.user.id}},{transaction:t})
    .then((noofrows)=>{
      if(noofrows===0){
        return res.status(404).json({success:false,message:"Expense doesnot belong to user"})
      }
     
    res.status(200).json({ide:uId,success:true,message:"deleted Successfully"});
    })
    await t.commit()
  }
  catch(err){
    await t.rollback()
    console.log(err)
    res.status(500).json({error:err,success:false,message:"failed"})
  }
}


const dayExpense= async (req,res,next) =>{
  console.log(req.body.date)
  const date=req.body.date
  try{
    const expenses = await Expense.findAll({
      where: {
        userId: req.user.id,
        date: date,
      },
      order: [['updatedAt', 'ASC']]  // Sort by date in ascending order
    });
    const incomes = await Income.findAll({
      where: {
        userId: req.user.id,
        date: date,
      },
      order: [['updatedAt', 'ASC']]  // Sort by date in ascending order
    })
    const combined = [...expenses, ...incomes]
    const sortedTransactions = combined.sort((a, b) => {
      return new Date(a.updatedAt) - new Date(b.updatedAt);
    })  
    res.status(201).json({newUserDetail:sortedTransactions,success:true});
  }
  catch(error){
    console.log(error)
  }
  
}
const weekExpense= async (req,res,next) =>{
  try{
  const year=req.body.year
  const week=req.body.week
  const expenses = await Expense.findAll({
    where: {
      userId: req.user.id,
      week: week,
      year: year
    },
    order: [['updatedAt', 'ASC']]  // Sort by date in ascending order
  });
  const incomes = await Income.findAll({
    where: {
      userId: req.user.id,
      week: week,
      year: year
    },
    order: [['updatedAt', 'ASC']]  // Sort by date in ascending order
  })
  const combined = [...expenses, ...incomes]
  const sortedTransactions = combined.sort((a, b) => {
    // Compare by 'date' field of each transaction
    return new Date(a.updatedAt) - new Date(b.updatedAt);
  })  
  res.status(201).json({newUserDetail:sortedTransactions,success:true});
  }
  catch(error){
    console.log(error)
  }
}


const monthExpense= async (req,res,next) =>{
  try{
  const year=req.body.year
  const month=req.body.month
  const expenses = await Expense.findAll({
    where: {
      userId: req.user.id,
      month: month,
      year: year
    },
    order: [['updatedAt', 'ASC']]  // Sort by date in ascending order
  });
  const incomes = await Income.findAll({
    where: {
      userId: req.user.id,
      month: month,
      year: year
    },
    order: [['updatedAt', 'ASC']]  // Sort by date in ascending order
  })
  const combined = [...expenses, ...incomes]
  const sortedTransactions = combined.sort((a, b) => {
    // Compare by 'date' field of each transaction
    console.log(a)
    return new Date(a.updatedAt) - new Date(b.updatedAt);
  })  
  res.status(201).json({newUserDetail:sortedTransactions,success:true});
  }
  catch(error){
    console.log(error)
  }
}


    
module.exports={
    addExpense,
    getExpense,
    deleteExpense,
    dayExpense,
    weekExpense,
    monthExpense
    
}