const Sequelize=require("sequelize");

const sequelize=require("../util/database");

const download=sequelize.define("totaldownloads",{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  date:{
    type:Sequelize.DATE
  },
  links:{
    type:Sequelize.STRING

  }
});

module.exports = download;
