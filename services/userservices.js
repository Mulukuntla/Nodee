const getExpenses=(req,where) =>{
    return req.user.getExpenseTrackers(where)
}

module.exports={
    getExpenses
}