// users.js (Routes)

const express=require("express")
const router=express.Router()
const passport=require("passport")

const usersControllers=require("../Controllers/Users Controllers")

router.get("/profile/:id",passport.checkAuthentication,usersControllers.profile)
router.post("/update/:id",passport.checkAuthentication,usersControllers.update)
router.get("/sign-up",usersControllers.signup)
router.get("/sign-in",usersControllers.signin)

router.post('/forget_passwordEmailSec',usersControllers.forget_passwordEmailSec)
router.get('/forgetPassword',usersControllers.forgetPassword)

router.get('/reset_password/',usersControllers.reset_password)
router.post('/forget_updata_password/',usersControllers.forget_updata_password);

router.post("/create",usersControllers.create)

// Use Passport As MiddleWare To Authenticate
router.post("/create-session",passport.authenticate(
  "local",
  {failureRedirect:"/users/sign-in"},
),usersControllers.createSession)

router.get("/sign-out",usersControllers.destroySession)

router.get("/auth/google",passport.authenticate("google", {scope: ["profile", "email"]}))
router.get("/auth/google/callback", passport.authenticate("google", {failureRedirect: "/users/sign-in"}), usersControllers.createSession)

module.exports=router