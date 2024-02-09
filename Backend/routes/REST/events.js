var express = require('express');
var router = express.Router();
var eventController = require('../../controllers/REST/EventController');

router.get('/getAll', eventController.getAllEvent);
router.get('/getById/:id', eventController.getEventById);

module.exports = router;