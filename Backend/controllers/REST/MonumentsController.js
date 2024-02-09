const Monument = require('../../models/Monument');
const Event = require('../../models/Event');

var restMonumentController = {};

restMonumentController.getAllMonument = async function (req, res) {
    try {
        const monuments = await Monument.find({});
        return res.status(200).send(monuments);
    } catch (err) {
        return res.status(500).send({
        message: 'Error retrieving monuments.',
        error: err,
        });
    }
    }

    restMonumentController.getEventByMonumentId = async function (req, res) {
    try {
        const events = await Event.find({monument_id: req.params.id});
        return res.status(200).send(events);
    } catch (err) {
        return res.status(500).send({
        message: 'Error retrieving events.',
        error: err,
        });
    }
    }

module.exports = restMonumentController;

