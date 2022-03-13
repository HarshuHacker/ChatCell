// likes.js (Routes)

const express = require("express")
const router = express.Router()
const likesController = require("../Controllers/likes_controller")

router.post("/toggle", likesController.toggleLike)

module.exports = router