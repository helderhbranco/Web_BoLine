var express = require('express');
var router = express.Router();
var authController = require('../controllers/AuthController');

router.get('/login', authController.loginForm );
router.post('/login' ,authController.login );

router.get('/logout', authController.logout );

router.get('/register', authController.registerForm );
router.post('/register', authController.register );
  
module.exports = router;