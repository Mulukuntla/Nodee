const Sequelize=require("sequelize");

const sequelize=require("../util/database");

const Expense=sequelize.define("ExpenseTracker",{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  expense: Sequelize.INTEGER,
  description:{
    type:Sequelize.STRING,
    
  },
  category:{
    type:Sequelize.STRING,
   
  },
  date:{
    type:Sequelize.DATEONLY

  },
  week:{
    type:Sequelize.INTEGER

  },
  month:{
    type:Sequelize.INTEGER
  },
  year:{
    type:Sequelize.INTEGER

  }
 
});

module.exports = Expense;
