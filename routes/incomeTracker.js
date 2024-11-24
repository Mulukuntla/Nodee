const express = require('express');
const userauthenticate=require("../middleware/auth")

const router = express.Router();
const userController=require("../controllers/incomeTracker")

router.post("/add-income",userauthenticate.authenticate,userController.addIncome)

router.get("/get-income",userauthenticate.authenticate,userController.getIncome)

router.delete("/delete-income/:id",userauthenticate.authenticate,userController.deleteIncome)

module.exports = router;