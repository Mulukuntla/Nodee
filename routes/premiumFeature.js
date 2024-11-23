

const express = require('express');
const userauthenticate=require("../middleware/auth")


const router = express.Router();
const userController=require("../controllers/premiumFeature")

router.get("/showLeaderboard",userauthenticate.authenticate,userController.getUserLeaderBoard)



module.exports = router;