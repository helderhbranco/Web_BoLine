var express = require('express');
var router = express.Router();
var restUserController = require('../../controllers/REST/UserController');

router.get('/show', restUserController.getUser);
router.put('/edit', restUserController.updateUser);
router.get('/tickets', restUserController.tickets);
  
module.exports = router;