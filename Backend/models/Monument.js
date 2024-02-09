// Model : Monument
/*
    Monument (Geoapify) : https://apidocs.geoapify.com/v1/geocode/monument
    - name
    - address
        - street
        - city
        - county
        - postcode
        - country
        - formatted (full address)
    - coordinates
        - lat
        - lon
    - place_id (PK)
    - status (Inactive, Active)
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MonumentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        county: {
            type: String,
            required: true
        },
        postcode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        formatted: {
            type: String,
            required: true
        }
    },
    coordinates: {
        lat: {
            type: Number,
            required: true
        },
        lon: {
            type: Number,
            required: true
        }
    },
    place_id: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    }
});

const Monument = mongoose.model('Monument', MonumentSchema);

module.exports = Monument;