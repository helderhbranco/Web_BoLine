var express = require('express');
var router = express.Router();

var userController = require('../controllers/UserController');
var authController = require('../controllers/AuthController');

router.get('/show', authController.verifyTokenAdmin, userController.showAll);

router.get('/show/:id', authController.verifyTokenAdmin, userController.show);

router.get('/create', authController.verifyTokenAdmin, userController.formCreate);
router.post('/create', authController.verifyTokenAdmin, userController.create);

router.get('/edit/:id', authController.verifyTokenAdmin, userController.formEdit);
router.post('/edit/:id', authController.verifyTokenAdmin, userController.edit);

router.get('/delete/:id', authController.verifyTokenAdmin, userController.formDelete);
router.post('/delete/:id', authController.verifyTokenAdmin, userController.delete);

module.exports = router;
