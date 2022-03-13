const express = require('express');
const passport = require('passport');
const router = express.Router();
const friendshipController = require('../Controllers/friendship_controller');

//friendship/addfriend
router.post('/addfriend',friendshipController.addFriends);

module.exports = router;