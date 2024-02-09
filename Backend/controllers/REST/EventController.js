const Event = require("../../models/Event");

var restEventController = {};

restEventController.getAllEvent = async function (req, res) {
  try {
    const events = await Event.find({});
    return res.status(200).send(events);
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving events.",
      error: err,
    });
  }
};

restEventController.getEventById = async function (req, res) {
  try {
    const event = await Event.findById(req.params.id);
    return res.status(200).send(event);
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving event.",
      error: err,
    });
  }
};

module.exports = restEventController;
