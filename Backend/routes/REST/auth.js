var express = require('express');
var router = express.Router();
var authController = require('../../controllers/REST/AuthController');

router.post('/login', authController.login);
router.post('/register', authController.register);
  
module.exports = router;