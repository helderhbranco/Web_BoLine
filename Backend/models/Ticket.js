// Model : Ticket
/*
    Ticket
    - user_id
    - event_id
    - status
    - price
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    event_id: {
        type: String,
        required: true
    },
    status: {
        //ativo- antes de usar
        //cancelado- evento cancelado ou cancelamento do utilizador
        //expirado - não usado
        //usado- depois de valido
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;
