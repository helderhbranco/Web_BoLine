var express = require('express');
var router = express.Router();
var ticketController = require('../../controllers/REST/TicketController');

router.get('/free/:event_id/:qnt', ticketController.freeTickets);

router.post('/buy/:event_id/:qntTotal/:qntFree', ticketController.buyTicket);

module.exports = router;