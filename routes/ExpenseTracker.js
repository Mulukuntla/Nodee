
const express = require('express');
const userauthenticate=require("../middleware/auth")

const router = express.Router();
const userController=require("../controllers/ExpenseTracker")

router.post("/add-expense",userauthenticate.authenticate,userController.addExpense);
router.get("/get-expense",userauthenticate.authenticate,userController.getExpense)

router.delete("/delete-expense/:id",userauthenticate.authenticate,userController.deleteExpense)

module.exports = router;