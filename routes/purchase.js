

const express = require('express');
const userauthenticate=require("../middleware/auth")


const router = express.Router();
const userController=require("../controllers/purchase")

router.get("/premiummembership",userauthenticate.authenticate,userController.purchasepremium)

router.post("/updatetransactionstatus",userauthenticate.authenticate,userController.updatetransactionstatus);

router.post("/updatetransactionstatusfailed",userauthenticate.authenticate,userController.updatetransactionstatusfailed);


module.exports = router;