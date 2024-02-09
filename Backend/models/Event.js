// Model : Event
/*
    Event
    - id
    - name
    - description
    - date
    - status
    - monument_id
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: false
    },
    date_final: {
        type: Date,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    },
    monument_id: {
        type: String,
        required: true
        //type: Schema.Types.ObjectId,
        //ref: 'Monument'
    },
    price: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    id: {
        type: Number,
        required: false
    },
    event_place_name: {
        type: String,
        required: true
    },
    instante_capacity: {
        type: Number,
        required: false
    },
    photo: {
        type: String,
        required: false
    }
});

Event = mongoose.model('Event', EventSchema);

module.exports = Event;