const express = require('express');
const userauthenticate=require("../middleware/auth")

const router = express.Router();
const resetpasswordController=require("../controllers/forgotPassword")

router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

router.get('/resetpassword/:id', resetpasswordController.resetpassword)

router.use('/forgotpassword', resetpasswordController.forgotpassword)

module.exports = router;