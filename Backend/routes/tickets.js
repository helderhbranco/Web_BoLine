var express = require('express');
const ticketsController = require('../controllers/TicketController');
var router = express.Router();
const authController = require('../controllers/AuthController');


router.get('/create',authController.verifyTokenAdmin, ticketsController.showCreate);
router.post('/create', authController.verifyTokenAdmin, ticketsController.create);
 

  module.exports = router;