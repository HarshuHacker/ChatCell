// route.js (Routes)

const express=require("express")
const router=express.Router()
const homeController=require("../Controllers/Home Controller")

router.get("/",homeController.home)
router.use("/users",require("./users"))
router.use("/posts",require("./post"))
router.use("/comments",require("./comments"))
router.use("/likes",require("./likes"))
router.use('/friendship',require('./friendship'));

router.use("/api",require("./API"))

module.exports=router