

const express = require('express');


const router = express.Router();
const userController=require("../controllers/Expense")
const userauthenticate=require("../middleware/auth")

router.post("/signup",userController.signup);
router.post("/signin",userController.signin);
router.get("/download",userauthenticate.authenticate,userController.download);
router.get("/totaldownloads",userauthenticate.authenticate,userController.totaldownloads);
module.exports = router;