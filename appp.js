const getUserLeaderBoard=async (req,res,next)=>{
    try{
        const userLeaderBoardDetails=await Users.findAll({
            attributes:["id","Username",[sequelize.fn("sum",sequelize.col("ExpenseTrackers.expense")),"total_cost"]],
            include:[
                {
                model:Expense,
                attributes:[]
                }
            ],
            group:["user.id"],
            order:[["total_cost","DESC"]]


        })
        console.log(userLeaderBoardDetails[0])
        res.status(200).json({userLeaderBoardDetails})

    }
    catch(err){
        console.log(err)
        res.status(500).json(err)

    }
}
-----------------------------------------------------------------------------------------
const getUserLeaderBoard=async (req,res,next)=>{
    try{
        const userLeaderBoardDetails=await Users.findAll({
            attributes:["id","Username",[sequelize.fn("sum",sequelize.col("ExpenseTrackers.expense")),"total_cost"]],
            include:[
                {
                model:Expense,
                attributes:[]
                }
            ],
            group:["user.id"],
            order:[["total_cost","DESC"]]


        })
        console.log(userLeaderBoardDetails[0])
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