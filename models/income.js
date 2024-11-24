const Sequelize=require("sequelize");

const sequelize=require("../util/database");

const income=sequelize.define("incomeTracker",{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  income: Sequelize.INTEGER,
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

module.exports = income;
