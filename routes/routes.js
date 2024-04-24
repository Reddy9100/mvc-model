const express = require("express")

const router = express.Router()



const userController = require("../controller/userCntrl")
const cityController = require("../controller/cityCntrl")

//NOTE - USER ROUTES *****************/

router.post("/signup",userController.signupUser)

router.post("/login",userController.loginUser)

// router.post("/forgotPassword",userController.sendMailToUSer)

router.put("/updatePassword",userController.updatePasswordController)

/********************************************/


//NOTE -  CITY ROUTES ***********/

router.get("/cities",cityController.getAllCities)
router.post("/newcity",cityController.cityEntry)

/**********************************************/

module.exports = router