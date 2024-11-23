const Expense= require("../models/ExpenseTracker")
const totalExpensess= require("../models/Expense")
const sequelize = require("../util/database")
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
      
      console.log(expense,description,category)
      
      
      const data=await Expense.create({expense:expense,description:description,category:category,userId:req.user.id},{transaction:t})
      
      const totalExpen=Number(req.user.totalExpenses)+Number(expense)
      console.log(totalExpen)
      await totalExpensess.update({
            totalExpenses:totalExpen
          },
          {
            where:{id:req.user.id},
            transaction:t
          }
        )
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
      const users= await Expense.findAll({where:{userId:req.user.id}});
      console.log(users)  
      res.status(200).json({allUsers :users});
      //{where:{userId:req.user.id}}
  
    }
    catch(error){
      console.log("Get user is failing",JSON.stringify(error))
      res.status(500).json({error:error})
    }
  }

const deleteExpense= async (req,res) => {
  const t=await sequelize.transaction()  
    try{
    
      
    const uId=req.params.id;
    const expense=await Expense.findOne({where:{id:req.params.id}})
    console.log(expense.expense)
    const user=await totalExpensess.findOne({where:{id:req.user.id}})
    var expenses=Number(user.totalExpenses)-Number(expense.expense)
    await user.update({totalExpenses:expenses},{transaction:t})
    if(isstringvalid(uId)){
        return res.status(400).json({success:false,message:"not an valid id"})
    }
    Expense.destroy({where:{userId:uId,userId:req.user.id}},{transaction:t})
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

 
    
    
module.exports={
    addExpense,
    getExpense,
    deleteExpense,
    
}