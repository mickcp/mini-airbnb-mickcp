const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user.js");
const {saveRedirectUrl} = require("../authenticateMw.js");
const userController = require("../controllers/users.js")
const wrapAsync = require("../utils/wrapasync.js");


router.route("/signup")
.get(userController.renderSignupform)
.post( wrapAsync (userController.signup));


router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect:'/login', failureFlash:true}),
 wrapAsync(userController.login)
);


// logout
router.get("/logout",userController.logout);













// let registereduser = await User.register(userone,"Paristokyo@123");
// res.send(registereduser);

module.exports = router;
