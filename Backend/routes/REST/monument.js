var express = require('express');
var router = express.Router();
var monumentController = require('../../controllers/REST/MonumentsController');

router.get('/getAll', monumentController.getAllMonument);
router.get('/getEventByMonumentId/:id', monumentController.getEventByMonumentId);

module.exports = router;